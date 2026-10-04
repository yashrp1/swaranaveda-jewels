#!/usr/bin/env python3
import subprocess, time, json, urllib.request, base64, socket, urllib.parse, os
from PIL import Image

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

    def evaluate(self, expr):
        res = self.send("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        if res and "result" in res and "result" in res["result"]:
            return res["result"]["result"].get("value")
        return None

    def screenshot(self, filename):
        shot = self.send("Page.captureScreenshot", {"format": "png"})
        if shot and "result" in shot and "data" in shot["result"]:
            data = base64.b64decode(shot["result"]["data"])
            with open(filename, "wb") as f:
                f.write(data)
            print(f"Captured {filename} ({len(data)} bytes)")
            return filename
        return None

    def close(self):
        try: self.s.close()
        except: pass

def run_test():
    rec_dir = "/Users/indigi/.gemini/antigravity-ide/brain/92244451-343e-4314-8432-a8e308547d9a/recordings"
    os.makedirs(rec_dir, exist_ok=True)

    proc = subprocess.Popen([
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '--headless=new',
        '--remote-debugging-port=9222',
        '--disable-gpu',
        '--window-size=1440,900',
        'http://localhost:3000/index.html'
    ])
    time.sleep(2.5)

    captured_images = []
    try:
        tabs = json.loads(urllib.request.urlopen('http://localhost:9222/json').read())
        page_tab = [t for t in tabs if t.get('type') == 'page'][0]
        ws_url = page_tab['webSocketDebuggerUrl']
        print("Connected to Chrome CDP:", ws_url)

        client = ChromeClient(ws_url)
        client.send("Page.enable")
        time.sleep(1.5)

        # 1. Check title & canvas presence
        title = client.evaluate("document.title")
        print("Page Title:", title)
        canvas_info = client.evaluate("const c = document.getElementById('hero-scroll-canvas'); c ? {w: c.width, h: c.height} : null")
        print("Canvas Info:", canvas_info)

        # 2. Capture Initial Hero Cover (Scroll = 0)
        client.evaluate("window.scrollTo(0, 0);")
        time.sleep(1.0)
        img0 = os.path.join(rec_dir, "01_hero_editorial_cover.png")
        client.screenshot(img0)
        captured_images.append(img0)

        # 3. Scroll to the 3D Cinematic Showroom
        showroom_track_top = client.evaluate("document.getElementById('hero-scroll-experience').offsetTop")
        print("Showroom Track Top:", showroom_track_top)
        
        # Scrub through the 3D necklace sequence
        steps = [0, 600, 1200, 1800, 2400]
        for idx, offset in enumerate(steps, start=2):
            target_y = showroom_track_top + offset
            client.evaluate(f"window.scrollTo(0, {target_y});")
            time.sleep(0.4)
            step_img = os.path.join(rec_dir, f"{idx:02d}_scrub_{offset}px.png")
            client.screenshot(step_img)
            captured_images.append(step_img)

        # 4. Check Settled State & Interactive Switcher
        hud_active = client.evaluate("document.getElementById('showcase-interactive-ui').classList.contains('active')")
        print("Interactive HUD Active:", hud_active)
        piece_title = client.evaluate("document.getElementById('showcase-piece-title').innerText")
        print("Current Piece Title:", piece_title)

        # 5. Click NEXT -> to Piece 02 (Mayur Dome Jhumkas)
        print("Clicking NEXT piece button...")
        client.evaluate("document.getElementById('btn-next-piece').click();")
        time.sleep(1.0)
        img_p2 = os.path.join(rec_dir, "07_piece_02_jhumkas.png")
        client.screenshot(img_p2)
        captured_images.append(img_p2)

        # 6. Click DIAMOND Category Pill
        print("Switching category to DIAMOND...")
        client.evaluate("document.querySelector('[data-cat=\"diamond\"]').click();")
        time.sleep(1.0)
        img_dia = os.path.join(rec_dir, "08_category_diamond.png")
        client.screenshot(img_dia)
        captured_images.append(img_dia)

        # 7. Scroll into Chapter 01 (Our Heritage)
        heritage_top = client.evaluate("document.getElementById('section-heritage').offsetTop")
        print("Heritage Section Top:", heritage_top)
        client.evaluate(f"window.scrollTo(0, {heritage_top});")
        time.sleep(1.0)
        img_heritage = os.path.join(rec_dir, "09_chapter_01_heritage.png")
        client.screenshot(img_heritage)
        captured_images.append(img_heritage)

        # 8. Scroll into Chapter 02 (The Craft)
        craft_top = client.evaluate("document.getElementById('section-craft').offsetTop")
        print("Craft Section Top:", craft_top)
        client.evaluate(f"window.scrollTo(0, {craft_top});")
        time.sleep(1.0)
        img_craft = os.path.join(rec_dir, "10_chapter_02_craft.png")
        client.screenshot(img_craft)
        captured_images.append(img_craft)

        # 9. Scroll into Chapter 03 (Culture - Brahmaputra River)
        culture_top = client.evaluate("document.getElementById('section-culture').offsetTop")
        print("Culture Section Top:", culture_top)
        client.evaluate(f"window.scrollTo(0, {culture_top});")
        time.sleep(1.0)
        img_culture = os.path.join(rec_dir, "11_chapter_03_culture.png")
        client.screenshot(img_culture)
        captured_images.append(img_culture)

        # 10. Scroll into Chapter 04 (Patrons)
        patrons_top = client.evaluate("document.getElementById('section-patrons').offsetTop")
        print("Patrons Section Top:", patrons_top)
        client.evaluate(f"window.scrollTo(0, {patrons_top});")
        time.sleep(1.0)
        img_patrons = os.path.join(rec_dir, "12_chapter_04_patrons.png")
        client.screenshot(img_patrons)
        captured_images.append(img_patrons)

        # 11. Scroll into Chapter 05 (Atelier Salon & Footer)
        showroom_top = client.evaluate("document.getElementById('section-showroom').offsetTop")
        print("Showroom Section Top:", showroom_top)
        client.evaluate(f"window.scrollTo(0, {showroom_top});")
        time.sleep(1.0)
        img_showroom = os.path.join(rec_dir, "13_chapter_05_salon.png")
        client.screenshot(img_showroom)
        captured_images.append(img_showroom)

        # 12. Open Private Atelier Appointment Modal
        print("Opening Appointment Modal...")
        client.evaluate("document.querySelector('.open-appointment-modal').click();")
        time.sleep(0.8)
        img_modal = os.path.join(rec_dir, "14_appointment_modal.png")
        client.screenshot(img_modal)
        captured_images.append(img_modal)

        # 12. Create animated WebP of the entire scroll & interaction journey!
        print(f"Creating animated recording from {len(captured_images)} captured states...")
        pil_imgs = [Image.open(p).convert('RGB') for p in captured_images]
        # Crisp animated WebP presentation
        anim_imgs = [img.resize((1080, 675), Image.Resampling.LANCZOS) for img in pil_imgs]
        
        # Frame durations in ms
        durations = [1500] * len(anim_imgs)
        
        anim_path = os.path.join(rec_dir, "swarnaveda_screen_recording.webp")
        anim_imgs[0].save(
            anim_path,
            save_all=True,
            append_images=anim_imgs[1:],
            duration=durations,
            loop=0,
            quality=90
        )
        print("Screen recording animation successfully created:", anim_path)

        client.close()
    finally:
        proc.terminate()

if __name__ == '__main__':
    run_test()
