#!/usr/bin/env python3
import subprocess, time, json, urllib.request, base64, socket, urllib.parse

class ChromeClient:
    def __init__(self, ws_url):
        parsed = urllib.parse.urlparse(ws_url)
        self.s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.s.connect((parsed.hostname, parsed.port))

        key = "dGhlIHNhbXBsZSBub25jZQ=="
        handshake = (
            f"GET {parsed.path} HTTP/1.1\r\n"
            f"Host: {parsed.hostname}:{parsed.port}\r\n"
            f"Upgrade: websocket\r\n"
            f"Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            f"Sec-WebSocket-Version: 13\r\n\r\n"
        )
        self.s.sendall(handshake.encode())
        resp = self.s.recv(4096).decode()
        if "101" not in resp:
            raise Exception("Handshake failed: " + resp)
        self.msg_id = 0

    def send(self, method, params=None):
        self.msg_id += 1
        msg = json.dumps({"id": self.msg_id, "method": method, "params": params or {}}).encode()
        length = len(msg)

        frame = bytearray([0x81])
        if length <= 125:
            frame.append(0x80 | length)
        elif length <= 65535:
            frame.append(0x80 | 126)
            frame.extend(length.to_bytes(2, 'big'))
        else:
            frame.append(0x80 | 127)
            frame.extend(length.to_bytes(8, 'big'))

        mask = bytearray([1, 2, 3, 4])
        frame.extend(mask)
        frame.extend(bytearray(b ^ mask[i % 4] for i, b in enumerate(msg)))
        self.s.sendall(frame)

        # Read responses until we get the response matching our msg_id
        while True:
            header = self.s.recv(2)
            if not header or len(header) < 2:
                return None
            plen = header[1] & 0x7f
            if plen == 126:
                ext = self.s.recv(2)
                plen = int.from_bytes(ext, 'big')
            elif plen == 127:
                ext = self.s.recv(8)
                plen = int.from_bytes(ext, 'big')

            payload_bytes = bytearray()
            while len(payload_bytes) < plen:
                chunk = self.s.recv(min(65536, plen - len(payload_bytes)))
                if not chunk: break
                payload_bytes.extend(chunk)

            try:
                res = json.loads(payload_bytes.decode(errors='ignore'))
                if res.get("id") == self.msg_id:
                    return res
            except:
                pass

    def close(self):
        try: self.s.close()
        except: pass

def test_scroll_captures():
    proc = subprocess.Popen([
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '--headless=new',
        '--remote-debugging-port=9222',
        '--disable-gpu',
        '--window-size=1440,900',
        'http://localhost:3000/'
    ])
    time.sleep(2)
    try:
        tabs = json.loads(urllib.request.urlopen('http://localhost:9222/json').read())
        page_tab = [t for t in tabs if t.get('type') == 'page'][0]
        ws_url = page_tab['webSocketDebuggerUrl']
        print("Connected to:", ws_url)

        client = ChromeClient(ws_url)
        client.send("Page.enable")
        time.sleep(1)

        scrolls = [0, 800, 1600, 2400, 3200]
        for s in scrolls:
            print(f"Scrolling to {s}px...")
            client.send("Runtime.evaluate", {"expression": f"window.scrollTo(0, {s});"})
            time.sleep(1.0)
            shot = client.send("Page.captureScreenshot", {"format": "png"})
            if shot and "result" in shot and "data" in shot["result"]:
                data = base64.b64decode(shot["result"]["data"])
                fname = f"scroll_{s}.png"
                with open(fname, "wb") as f:
                    f.write(data)
                print(f"Saved {fname} ({len(data)} bytes)")
        client.close()
    finally:
        proc.terminate()

if __name__ == '__main__':
    test_scroll_captures()
