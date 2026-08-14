import { useState, useEffect } from "react";
import { 
  Coffee, MapPin, Clock, Instagram, Phone, Mail, ChevronRight, 
  Menu as MenuIcon, X, Sparkles, Star, Award, Heart, ArrowUpRight,
  Utensils, Compass, ExternalLink, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Streamdown } from "streamdown";
import ScrollSequenceHero from "@/components/ScrollSequenceHero";
import { mondoSequenceFrames } from "@/data/mondoSequenceFrames";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("espresso");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuCategories = [
    {
      id: "espresso",
      name: "Espresso & Signature",
      items: [
        {
          name: "Signature Cortado",
          price: "180 ₺",
          description: "Double ristretto shot paired with silky textured microfoam in a classic glass.",
          badge: "Bestseller"
        },
        {
          name: "Flat White",
          price: "195 ₺",
          description: "Rich espresso infused with velvety microfoam and delicate latte art."
        },
        {
          name: "Mondo Special Pistachio Latte",
          price: "240 ₺",
          description: "Espresso with house-crafted organic pistachio cream, steamed milk, and crushed Antep pistachios.",
          badge: "Chef's Pick"
        },
        {
          name: "Caramel Macchiato",
          price: "210 ₺",
          description: "Vanilla bean infused milk marked with rich espresso and drizzled artisan caramel."
        },
        {
          name: "Café Mocha",
          price: "220 ₺",
          description: "Single-origin espresso blended with premium Belgian dark chocolate and steamed milk."
        }
      ]
    },
    {
      id: "brew",
      name: "Filter & V60 Pour Over",
      items: [
        {
          name: "Ethiopia Yirgacheffe V60",
          price: "210 ₺",
          description: "Light roast with sparkling floral notes, bergamot, and delicate peach undertones.",
          badge: "Single Origin"
        },
        {
          name: "Colombia Huila Pour Over",
          price: "210 ₺",
          description: "Medium roast showcasing caramel sweetness, red apple brightness, and milk chocolate finish."
        },
        {
          name: "Kenya Nyeri Chemex",
          price: "225 ₺",
          description: "Complex cup featuring blackcurrant acidity, rich body, and winey aromatic complexity."
        },
        {
          name: "Classic French Press",
          price: "190 ₺",
          description: "Full-immersion brew delivering a robust body and rich aromatic oils."
        }
      ]
    },
    {
      id: "cold",
      name: "Cold Brew & Refreshers",
      items: [
        {
          name: "Signature Cold Brew",
          price: "195 ₺",
          description: "Steeped for 18 hours in cold spring water, offering exceptionally smooth chocolate notes.",
          badge: "Signature"
        },
        {
          name: "Nitro Cold Brew",
          price: "220 ₺",
          description: "Cold brew infused with nitrogen gas for a cascading velvety head and creamy texture."
        },
        {
          name: "Iced Spanish Latte",
          price: "230 ₺",
          description: "Bold espresso shaken over ice with sweetened condensed milk and fresh whole milk."
        },
        {
          name: "Passion Fruit Cold Tonic",
          price: "215 ₺",
          description: "Single-origin espresso layered over artisanal botanical tonic water and passion fruit essence."
        }
      ]
    },
    {
      id: "desserts",
      name: "Artisanal Desserts & Treats",
      items: [
        {
          name: "San Sebastián Cheesecake",
          price: "280 ₺",
          description: "Ultra-creamy baked cheesecake with a caramelized burnt top, served with warm Belgian chocolate ganache.",
          badge: "Must Try"
        },
        {
          name: "Crispy Pistachio Cookie Pie",
          price: "260 ₺",
          description: "Warm cookie crust filled with rich pistachio praline and white chocolate chunks."
        },
        {
          name: "Belgian Dark Chocolate Brownie",
          price: "240 ₺",
          description: "Fudgy artisanal brownie baked with single-origin cocoa and sea salt flakes."
        },
        {
          name: "Berry Tiramisu",
          price: "250 ₺",
          description: "Savoiardi biscuits soaked in espresso and marsala, layered with mascarpone cream and fresh forest berries."
        }
      ]
    }
  ];

  const galleryImages = [
    {
      title: "Chocolate Chip Cookie Pie",
      subtitle: "Warm-baked cookie with a soft caramel center",
      url: "/manus-storage/mondo-gallery-cookie_094c4dad.png",
      tag: "Signature Pastry"
    },
    {
      title: "Strawberry Velvet",
      subtitle: "A strawberry-shaped signature confection",
      url: "/manus-storage/mondo-gallery-strawberry-velvet_5210e121.png",
      tag: "Seasonal Dessert"
    },
    {
      title: "Red Velvet Signature",
      subtitle: "Rich red velvet finish on a Mondo plate",
      url: "/manus-storage/mondo-gallery-red-velvet_25b66fd2.png",
      tag: "Signature Pastry"
    },
    {
      title: "Mango Glaze",
      subtitle: "Bright mango-toned seasonal pastry",
      url: "/manus-storage/mondo-gallery-mango_298b89dc.png",
      tag: "Seasonal Dessert"
    },
    {
      title: "Strawberry Cream Roll",
      subtitle: "Soft sponge, cream, and fresh strawberry",
      url: "/manus-storage/mondo-gallery-strawberry-roll_b0f6b1f5.png",
      tag: "Fresh Baked"
    },
    {
      title: "Pistachio Cream Roll",
      subtitle: "Pistachio-forward pastry with a delicate finish",
      url: "/manus-storage/mondo-gallery-pistachio-roll_a7020802.png",
      tag: "Fresh Baked"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2421] selection:bg-[#C28E38] selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#2D2421]/95 backdrop-blur-md py-4 shadow-lg text-[#FDFBF7]" : "bg-gradient-to-b from-[#2D2421]/80 to-transparent py-6 text-white"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-[#C28E38] flex items-center justify-center bg-[#2D2421] text-[#C28E38] group-hover:bg-[#C28E38] group-hover:text-white transition-all">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-wider">MONDO</span>
              <span className="block text-[10px] tracking-[0.3em] uppercase opacity-80">Coffee & Design Space</span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide">
            <a href="#about" className="hover:text-[#C28E38] transition-colors">About</a>
            <a href="#menu" className="hover:text-[#C28E38] transition-colors">Menu</a>
            <a href="#gallery" className="hover:text-[#C28E38] transition-colors">Gallery</a>
            <a href="#location" className="hover:text-[#C28E38] transition-colors">Location</a>
            <a href="https://www.instagram.com/mondoocoffee" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#C28E38] hover:underline">
              <Instagram className="w-4 h-4" /> @mondoocoffee
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="#location"
              className="px-5 py-2.5 rounded-full border border-[#C28E38] text-[#C28E38] hover:bg-[#C28E38] hover:text-white text-xs font-semibold tracking-wider uppercase transition-all"
            >
              Visit Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-current focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#2D2421] text-[#FDFBF7] shadow-xl border-t border-[#C28E38]/20 py-6 px-8 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-serif hover:text-[#C28E38]"
            >
              About
            </a>
            <a 
              href="#menu" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-serif hover:text-[#C28E38]"
            >
              Menu
            </a>
            <a 
              href="#gallery" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-serif hover:text-[#C28E38]"
            >
              Gallery
            </a>
            <a 
              href="#location" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-serif hover:text-[#C28E38]"
            >
              Location & Contact
            </a>
            <a 
              href="https://www.instagram.com/mondoocoffee" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#C28E38] pt-2 border-t border-white/10"
            >
              <Instagram className="w-5 h-5" /> @mondoocoffee
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <ScrollSequenceHero frameUrls={mondoSequenceFrames} />

      {/* About Section */}
      <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 text-[#A9782B] text-xs uppercase tracking-[0.3em] font-semibold">
              <Compass className="w-4 h-4" /> Our Story & Concept
            </div>
            
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2421] leading-tight">
              A New Way to Coffee in Esenyurt
            </h2>

            <p className="text-lg text-[#5A4D46] leading-relaxed">
              Mondo Coffee was born from a passion for uncompromising coffee craftsmanship and inspiring architectural aesthetics. Situated at <strong>İncirtepe, Doğan Araslı Blv. No:76/4, Esenyurt</strong>, our roastery and design space serves as an urban sanctuary for coffee aficionados and creative minds alike.
            </p>

            <p className="text-[#5A4D46] leading-relaxed">
              Every bean we roast is carefully selected from exceptional micro-lots around the world, brewed with surgical precision on state-of-the-art equipment. Beyond our specialty espresso and pour-over bar, Mondo offers daily fresh-baked artisanal desserts, signature pastries, and a tranquil atmosphere designed for moments of genuine connection.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#E5DFD5]">
              <div>
                <span className="block font-serif text-3xl font-bold text-[#2D2421]">100%</span>
                <span className="text-sm text-[#7A6B63]">Specialty Arabica Beans</span>
              </div>
              <div>
                <span className="block font-serif text-3xl font-bold text-[#2D2421]">09:00 - 00:00</span>
                <span className="text-sm text-[#7A6B63]">Open Everyday</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Mondo Coffee roastery and café atmosphere"
                className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-500"
              >
                <source src="/manus-storage/mondo-about-story_454ca9d1.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="absolute -bottom-6 -right-6 w-72 h-72 rounded-2xl bg-[#EFECE6] -z-10 border border-[#D9D0C1]" />
            <div className="absolute -top-6 -left-6 w-48 h-48 rounded-full bg-[#C28E38]/10 -z-10 blur-2xl" />
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 bg-[#F4EFE6] px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-[#A9782B] text-xs uppercase tracking-[0.3em] font-semibold">
              <Utensils className="w-4 h-4" /> Artisanal Offerings
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2421]">
              The Mondo Menu
            </h2>
            <p className="text-[#6B5D55]">
              From meticulous single-origin V60 pour-overs to artisanal San Sebastián cheesecakes, every creation is crafted to elevate your daily ritual.
            </p>
          </div>

          <Tabs defaultValue="espresso" className="w-full max-w-5xl mx-auto">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-1.5 bg-[#E6DFD3] rounded-2xl mb-12">
              {menuCategories.map((cat) => (
                <TabsTrigger 
                  key={cat.id} 
                  value={cat.id}
                  className="py-3 rounded-xl font-medium text-sm transition-all data-[state=active]:bg-[#2D2421] data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {menuCategories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id} className="animate-in fade-in-50 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cat.items.map((item, idx) => (
                    <Card key={idx} className="bg-white/80 backdrop-blur-sm border border-[#E5DFD5] hover:shadow-lg transition-all rounded-2xl overflow-hidden">
                      <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-serif text-xl font-bold text-[#2D2421]">{item.name}</h3>
                            <span className="font-serif text-lg font-semibold text-[#A9782B] whitespace-nowrap">{item.price}</span>
                          </div>
                          <p className="text-[#6B5D55] text-sm leading-relaxed mb-4">{item.description}</p>
                        </div>
                        {item.badge && (
                          <div className="flex items-center">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C28E38]/10 text-[#A9782B] text-xs font-semibold tracking-wider uppercase">
                              <Star className="w-3 h-3 fill-[#A9782B]" /> {item.badge}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-[#A9782B] text-xs uppercase tracking-[0.3em] font-semibold">
            <Sparkles className="w-4 h-4" /> Visual Moments
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D2421]">
            Café & Roastery Gallery
          </h2>
          <p className="text-[#6B5D55]">
            Step inside Mondo Coffee Esenyurt — where warm ambient lighting, elegant interiors, and exquisite treats create an unforgettable atmosphere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="group relative rounded-2xl overflow-hidden shadow-md aspect-[4/3] bg-[#EFECE6]">
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D2421]/90 via-[#2D2421]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-xs uppercase tracking-[0.2em] text-[#E5B25D] font-semibold mb-1">{img.tag}</span>
                <h3 className="font-serif text-xl font-bold">{img.title}</h3>
                <p className="text-sm text-[#E8E2D5] font-light">{img.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Location & Contact Section */}
      <section id="location" className="py-24 bg-[#1E1613] text-white px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 text-[#E5B25D] text-xs uppercase tracking-[0.3em] font-semibold">
                <MapPin className="w-4 h-4" /> Find Us
              </div>
              
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
                Visit Mondo Coffee Esenyurt
              </h2>

              <p className="text-[#C5BCB3] text-lg leading-relaxed">
                We invite you to experience our third-wave coffee roastery and design space. Join us for your morning brew, afternoon work session, or evening dessert pairing.
              </p>

              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#C28E38]/20 text-[#E5B25D] border border-[#C28E38]/30">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-white">Address</h3>
                    <p className="text-[#C5BCB3]">İncirtepe, Doğan Araslı Blv. No:76/4, Esenyurt</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#C28E38]/20 text-[#E5B25D] border border-[#C28E38]/30">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-white">Opening Hours</h3>
                    <p className="text-[#C5BCB3]">09:00–00:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#C28E38]/20 text-[#E5B25D] border border-[#C28E38]/30">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-white">Social Media</h3>
                    <a href="https://www.instagram.com/mondoocoffee" target="_blank" rel="noopener noreferrer" className="text-[#E5B25D] hover:underline flex items-center gap-1 font-medium">
                      @mondoocoffee <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <a 
                  href="https://maps.google.com/?q=Mondo+Coffee+Esenyurt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-[#C28E38] hover:bg-[#A9782B] text-white font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-[#C28E38]/20"
                >
                  Open in Google Maps <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Embedded Google Maps Widget */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/15 h-[450px] bg-[#2D2421]">
              <iframe 
                title="Mondo Coffee Esenyurt Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.2815340624835!2d28.6789233!3d41.034338!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa100346c4b2b%3A0x5e5b3b3b3b3b3b3b!2sMondo%20Coffee!5e0!3m2!1sen!2str!4v1700000000000!5m2!1sen!2str" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale contrast-125 opacity-90 hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Banner Section */}
      <section className="py-16 bg-[#C28E38] text-white px-6 md:px-12 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <Instagram className="w-10 h-10 mx-auto opacity-90" />
          <h2 className="font-serif text-3xl md:text-4xl font-bold">Follow Our Journey</h2>
          <p className="text-white/90 max-w-xl mx-auto text-lg">
            Stay updated with our newest coffee beans, seasonal desserts, and architectural highlights on Instagram.
          </p>
          <div className="pt-2">
            <a 
              href="https://www.instagram.com/mondoocoffee" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#2D2421] text-white font-semibold text-sm hover:bg-[#1E1613] transition-all shadow-xl"
            >
              @mondoocoffee <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#18110F] text-[#A3978E] py-16 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#C28E38] flex items-center justify-center bg-[#2D2421] text-[#C28E38]">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-wider">MONDO COFFEE</span>
            </div>
            <p className="text-sm max-w-sm leading-relaxed text-[#8C8077]">
              Third-wave coffee roastery and design space in Esenyurt, Istanbul. Dedicated to supreme coffee quality, artisanal sweets, and refined architectural ambiance.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#about" className="hover:text-[#E5B25D] transition-colors">About Us</a></li>
              <li><a href="#menu" className="hover:text-[#E5B25D] transition-colors">Artisanal Menu</a></li>
              <li><a href="#gallery" className="hover:text-[#E5B25D] transition-colors">Gallery</a></li>
              <li><a href="#location" className="hover:text-[#E5B25D] transition-colors">Location & Hours</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-white">Contact & Social</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="https://www.instagram.com/mondoocoffee" target="_blank" rel="noopener noreferrer" className="hover:text-[#E5B25D] transition-colors flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-[#C28E38]" /> @mondoocoffee
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C28E38] shrink-0 mt-0.5" />
                <span>İncirtepe, Doğan Araslı Blv. No:76/4, Esenyurt / İstanbul</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C28E38] shrink-0" />
                <span>09:00 – 00:00 Daily</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-[#7A6D65]">
          <p>© {new Date().getFullYear()} Mondo Coffee. All rights reserved.</p>
          <p className="mt-4 md:mt-0 flex items-center gap-1">
            Third-Wave Roastery & Design Space · Esenyurt, Istanbul
          </p>
        </div>
      </footer>
    </div>
  );
}
