/* ===================================================================
   SWARNAVEDA JEWELS — JEWELLERY DATA & SHOWROOM CONFIGURATION
   Modular architecture supporting Gold, Diamond, and Silver Collections
   Each piece contains metadata, asset paths, scale, and environment themes.
   =================================================================== */

window.SWARNAVEDA_CONFIG = {
  // Brand details
  brand: {
    name: "SWARNAVEDA",
    tagline: "Carrying forward four generations of heritage from L Gopal Jewellers.",
    legacy: "Over 40 years of trust. Four generations of ancestral Assamese goldsmithing.",
    showroom: {
      address: "Panna Tower, Jail Road, Fancy Bazaar",
      city: "Guwahati, Assam 781001",
      phone: "+91 361 254 0000",
      hours: "Monday – Saturday: 11:00 AM – 7:30 PM (Private Salons by discrete appointment)"
    },
    instagram: "https://www.instagram.com/swarnavedajewels/"
  },

  // Environment themes
  environments: {
    gold: {
      id: "gold",
      name: "The Royal Atelier",
      bgClass: "env-gold",
      bgPrimary: "#0B0A08",
      accent: "#C8A96B",
      accentSecondary: "#E7D8BD",
      metal: "22K Antique Champagne Gold",
      lighting: "warm-champagne",
      soundTone: 108 // Hz base
    },
    diamond: {
      id: "diamond",
      name: "The Crystal Sanctuary",
      bgClass: "env-diamond",
      bgPrimary: "#07080A",
      accent: "#D6E4EE",
      accentSecondary: "#F0F6FA",
      metal: "Platinum & D-Flawless Diamonds",
      lighting: "controlled-white",
      soundTone: 144 // Hz
    },
    silver: {
      id: "silver",
      name: "The Moonlit Vault",
      bgClass: "env-silver",
      bgPrimary: "#05080E",
      accent: "#A8B4C0",
      accentSecondary: "#DDE4EC",
      metal: "Ancestral Oxidized Sterling Silver",
      lighting: "moonlit-silver",
      soundTone: 96 // Hz
    }
  },

  // Collections catalogue
  collections: {
    gold: {
      id: "gold",
      label: "GOLD COLLECTION",
      shortLabel: "GOLD",
      environment: "gold",
      items: [
        {
          id: "gold-necklace",
          category: "gold",
          categoryName: "GOLD",
          type: "NECKLACE",
          title: "The Royal Assamese Choker",
          subtitle: "22K Antique Gold with Central Ruby Cabochon, Polki & Pearl Drops",
          description: "An Assamese heirloom collar, hand-linked in antique gold and centered with a ruby cabochon, polki and pearl drops.",
          specs: [
            "22K Handcrafted Antique Champagne Gold",
            "Natural Untreated Burmese Ruby Medallion (4.20 ct)",
            "Polki Diamonds & Natural Basra Seed Pearls",
            "Over 320 Artisan Atelier Fabrication Hours"
          ],
          hasSequence: true,
          frameCount: 60,
          framePath: "assets/jewellery/gold/hero-necklace/hero-necklace-{index}.webp",
          heroImage: "assets/jewellery/gold/necklace/hero_transparent.png",
          scale: 1.0,
          scaleExit: 0.88,
          rotExit: 18,
          position: { x: 0, y: 0 }
        },
        {
          id: "gold-earrings",
          category: "gold",
          categoryName: "GOLD",
          type: "EARRINGS",
          title: "The Mayur Dome Jhumkas",
          subtitle: "Articulated Royal Bell Jhumkas with Rubies & Pearl Clusters",
          description: "Sculpted with sacred temple bell proportions. The floral stud leads into an openwork jaali bell adorned with handset polki diamond florets and kinetic natural pearl drops that chime in rhythm with movement.",
          specs: [
            "22K Brushed & Mirror Champagne Gold",
            "Cabochon Ruby Solitaires with Polki Accents",
            "Cascading Basra Pearl Clusters",
            "140 Atelier Hours"
          ],
          hasSequence: false,
          heroImage: "assets/jewellery/gold/earrings/hero_transparent.png",
          scale: 0.95,
          scaleExit: 0.82,
          rotExit: -15,
          position: { x: 0, y: 0 }
        },
        {
          id: "gold-ring",
          category: "gold",
          categoryName: "GOLD",
          type: "RING",
          title: "The Veda Solitaire Ring",
          subtitle: "Architectural Split-Shank with Emerald-Cut Flawless Diamond",
          description: "A monumental high-jewellery solitaire featuring an elongated emerald-cut diamond elevated upon towering cathedral arches in 18K brushed champagne gold, edged with dual rows of brilliant micro-pavé.",
          specs: [
            "3.50 Carat D-Flawless Emerald-Cut Diamond",
            "18K Brushed Antique Champagne Gold",
            "Secret Lotus Gallery Prongs",
            "110 Atelier Hours"
          ],
          hasSequence: false,
          heroImage: "assets/jewellery/gold/ring/hero_transparent.png",
          scale: 0.90,
          scaleExit: 0.78,
          rotExit: 20,
          position: { x: 0, y: 0 }
        },
        {
          id: "gold-bangle",
          category: "gold",
          categoryName: "GOLD",
          type: "BANGLE",
          title: "The Surya Architectural Kada",
          subtitle: "Repoussé Floral Chiseled Solid Gold Bangle",
          description: "Forged from a solid ingot of 22K gold, chiseled by hand using ancient repoussé punches to raise sacred Brahmaputra lotus motifs against a finely stippled antique matte ground.",
          specs: [
            "22K Solid Hand-Chiseled Gold",
            "Concealed Screw-Hinge Tension Clasp",
            "Heritage Repoussé Technique",
            "165 Atelier Hours"
          ],
          hasSequence: false,
          heroImage: "assets/jewellery/gold/bangle/hero_transparent.png",
          scale: 0.92,
          scaleExit: 0.80,
          rotExit: -22,
          position: { x: 0, y: 0 }
        }
      ]
    },

    diamond: {
      id: "diamond",
      label: "DIAMOND COLLECTION",
      shortLabel: "DIAMOND",
      environment: "diamond",
      items: [
        {
          id: "diamond-necklace",
          category: "diamond",
          categoryName: "DIAMOND",
          type: "NECKLACE",
          title: "The Aurelia Diamond Cascades",
          subtitle: "Pear-Cut & Baguette Diamond Haute Joaillerie Collar",
          description: "A sculptural rivière of brilliant and baguette diamonds, finished with a luminous pear-cut center stone.",
          specs: [
            "18.40 Carats Total Diamond Weight (D-F, VVS1)",
            "Platinum 950 Floating Bezel Setting",
            "Articulated Kinetic Links for Silk-Like Contour",
            "280 Atelier Hours"
          ],
          hasSequence: false,
          heroImage: "assets/jewellery/diamond/necklace/hero_transparent.png",
          scale: 1.0,
          scaleExit: 0.86,
          rotExit: 16,
          position: { x: 0, y: 0 }
        },
        {
          id: "diamond-earrings",
          category: "diamond",
          categoryName: "DIAMOND",
          type: "EARRINGS",
          title: "The Prakash Teardrop Drops",
          subtitle: "Cascading Baguette Diamond Chandeliers",
          description: "Engineered with articulated micro-hinges that grant each descending baguette diamond independent kinetic sway, creating continuous prismatic scintillation as the wearer moves.",
          specs: [
            "6.80 Carats D/VVS Baguette & Pear Diamonds",
            "Ultra-lightweight Platinum Structure",
            "Ergonomic Balanced Weight Distribution",
            "125 Atelier Hours"
          ],
          hasSequence: false,
          heroImage: "assets/jewellery/diamond/earrings/hero_transparent.png",
          scale: 0.95,
          scaleExit: 0.82,
          rotExit: -18,
          position: { x: 0, y: 0 }
        },
        {
          id: "diamond-ring",
          category: "diamond",
          categoryName: "DIAMOND",
          type: "RING",
          title: "The Solitaire Veda Solitaire",
          subtitle: "3.50ct Emerald-Cut Solitaire on Platinum Cathedral",
          description: "A testament to structural minimalism. The emerald cut acts as a grand hall of mirrors, refracting pure white light into spectral caustics across razor-sharp step facets.",
          specs: [
            "3.50 ct Emerald-Cut Diamond (Type IIa)",
            "Platinum 950 Double Claw Prongs",
            "Micro-Pavé Hidden Halo",
            "95 Atelier Hours"
          ],
          hasSequence: false,
          heroImage: "assets/jewellery/diamond/ring/hero_transparent.png",
          scale: 0.92,
          scaleExit: 0.80,
          rotExit: 22,
          position: { x: 0, y: 0 }
        }
      ]
    },

    silver: {
      id: "silver",
      label: "SILVER COLLECTION",
      shortLabel: "SILVER",
      environment: "silver",
      items: [
        {
          id: "silver-necklace",
          category: "silver",
          categoryName: "SILVER",
          type: "NECKLACE",
          title: "The Brahmaputra Moonlit Torc",
          subtitle: "Solid Sterling Silver with Moonlit Basalt Patina",
          description: "A hand-forged sterling silver torc, darkened with an oxidized patina inspired by the Brahmaputra at dusk.",
          specs: [
            "925 Sterling Silver Hand-Forged Ingot",
            "Artisanal Sulphur Smoke Patination",
            "Seamless Sculptural Contour",
            "115 Atelier Hours"
          ],
          hasSequence: false,
          heroImage: "assets/jewellery/silver/necklace/hero_transparent.png",
          scale: 0.98,
          scaleExit: 0.85,
          rotExit: 18,
          position: { x: 0, y: 0 }
        },
        {
          id: "silver-earrings",
          category: "silver",
          categoryName: "SILVER",
          type: "EARRINGS",
          title: "The Tribal Lotus Filigree Drops",
          subtitle: "Oxidized Sterling Silver Bell Drops",
          description: "Delicate openwork filigree wire twisted by master silversmiths into blooming lotus petals, finished with blackened recesses that make the silver rim shine like moonlight.",
          specs: [
            "925 Sterling Silver Filigree",
            "Hand-Drawn 0.2mm Silver Wire",
            "Hypoallergenic Handcrafted Ear Hooks",
            "85 Atelier Hours"
          ],
          hasSequence: false,
          heroImage: "assets/jewellery/silver/earrings/hero_transparent.png",
          scale: 0.94,
          scaleExit: 0.82,
          rotExit: -16,
          position: { x: 0, y: 0 }
        },
        {
          id: "silver-bangle",
          category: "silver",
          categoryName: "SILVER",
          type: "BANGLE",
          title: "The Kamakhya Carved Silver Kada",
          subtitle: "Deep-Relief Floral Repoussé Sterling Cuff",
          description: "A substantial collector's cuff featuring continuous relief carving of ancient sacred flora, burnished on the high points with agate stone to achieve a shimmering contrast against dark oxidation.",
          specs: [
            "925 Pure Sterling Silver (145 grams)",
            "Deep Hand-Chiseled Bas-Relief",
            "Comfort-Fit Contoured Interior",
            "130 Atelier Hours"
          ],
          hasSequence: false,
          heroImage: "assets/jewellery/silver/bangle/hero_transparent.png",
          scale: 0.92,
          scaleExit: 0.80,
          rotExit: -20,
          position: { x: 0, y: 0 }
        }
      ]
    }
  }
};
