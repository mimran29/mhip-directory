import { useState } from "react";

// ─────────────────────────────────────────────────────────────
// DATA — from companies.js (WEBSITE DEVELOPMENT INFORMATION FORM)
// Photo arrays hold counts + labels for now; swap in local image
// paths once the Google Drive files are downloaded and hosted.
// ─────────────────────────────────────────────────────────────
const COMPANIES = [
  {
    id: "ryverra",
    name: "Ryverra Chocolate",
    legalName: "Ryverra Marketing Sdn Bhd",
    regNo: "1424604-K",
    lot: "01",
    founded: "2021",
    category: "Chocolate & Cocoa",
    hue: "#5B3A1E",
    logo: "/companies/ryverra/logo.png",
    tagline:
      "Halal-certified chocolate maker behind Ryverra, Estana, ReeVo and Qidoz — plus an interactive chocolate gallery.",
    background:
      "Ryverra Chocolate is a Malaysian halal-certified chocolate manufacturer specialising in chocolate and cocoa-based products. Through its brands Ryverra, Estana, ReeVo and Qidoz, the company also provides OEM, private-label and contract manufacturing for local and international markets. It also operates Ryverra Chocolate Story (RCS), an interactive chocolate gallery offering educational tours, tasting sessions and hands-on activities.",
    vision: "To become the leading manufacturer of healthy and Halal chocolate products in Asia.",
    mission: [
      "Ensure that every product produced is of the highest quality.",
      "Provide a skilled workforce and efficient production facilities.",
    ],
    coreValues: ["Quality", "Innovation", "Integrity", "Continuous Improvement"],
    whyChooseUs: [
      "Halal-certified, quality-assured products",
      "Wide range: bars, panned chocolates, cocoa beverages, confectionery",
      "OEM and private-label expertise",
      "Competitive pricing with premium quality",
      "Unique experience via Ryverra Chocolate Story",
    ],
    certifications: ["HALAL", "MeSTI"],
    oem: true,
    exports: ["Saudi Arabia", "China", "South Korea", "Canada", "UAE", "Singapore", "Sri Lanka", "Myanmar"],
    brands: ["Ryverra", "Estana", "ReeVo", "Qidoz"],
    bestSellers: ["Estana Dubai-Style Chocolate", "Estana Tiramisu Series"],
    featured: {
      name: "Estana Dubai-Style Chocolate",
      description:
        "A luxurious fusion of premium chocolate, crispy golden kunafa and rich nut fillings, inspired by iconic Middle Eastern desserts. Available in milk or dark chocolate with kunafa pistachio or kunafa hazelnut.",
      benefits: [
        "Premium ingredients with signature kunafa crunch",
        "Four variants: milk/dark × pistachio/hazelnut",
        "Halal-certified indulgence",
      ],
    },
    gallery: [
      { label: "Factory", src: "/companies/ryverra/factory-1.webp" },
      { label: "Factory", src: "/companies/ryverra/factory-2.webp" },
      { label: "Factory", src: "/companies/ryverra/factory-3.webp" },
      { label: "Factory", src: "/companies/ryverra/factory-4.webp" },
      { label: "Products", src: "/companies/ryverra/product-1.webp" },
      { label: "Products", src: "/companies/ryverra/product-2.webp" },
      { label: "Products", src: "/companies/ryverra/product-3.webp" },
      { label: "Products", src: "/companies/ryverra/product-4.webp" },
    ],
    contact: {
      person: "Mohd Hanafiah bin Moh Yunos",
      email: "hello.ryverra@gmail.com",
      whatsapp: "010-551 1282",
      phone: "010-551 1282",
      socials: [
        { kind: "Facebook", handle: "Ryverra Estana Reevo" },
        { kind: "Instagram", handle: "@ryverrachocolate" },
        { kind: "TikTok", handle: "@ryverrachocolatestory" },
      ],
    },
  },
  {
    id: "izzly",
    name: "Izzly Network",
    legalName: "Izzly Network Sdn Bhd",
    regNo: "202001031808 (1388128-P)",
    lot: "02",
    founded: "2020",
    category: "Seasonings & Mixes",
    hue: "#B0521E",
    logo: "/companies/Izzly/logo.png",
    tagline: "Food seasonings, instant mixes and culinary powders — Halal, safe and kitchen-ready.",
    background:
      "Izzly Network Sdn Bhd is a Malaysian food manufacturing company specialising in food seasonings, instant food mixes and culinary products. The company is committed to delivering high-quality, safe and Halal products, with a focus on quality assurance, innovation and customer satisfaction — suitable for both household and commercial use.",
    vision:
      "To be a leading healthy food manufacturer committed to long-term sustainable growth in our core business.",
    mission: [
      "Be responsive to changes in customer demands and excel in providing quality food products and service.",
      "Commit to innovation in producing food products as technology evolves.",
      "Offer career opportunities to improve living standards and produce more successful entrepreneurs.",
    ],
    coreValues: [
      "Quality Excellence",
      "Integrity & Trust",
      "Customer Satisfaction",
      "Teamwork",
      "Innovation",
      "Food Safety & Halal Compliance",
    ],
    whyChooseUs: [
      "Consistent taste and quality",
      "Halal-certified, food-safety compliant manufacturing",
      "Competitive pricing with reliable supply",
      "Dedicated customer support and efficient fulfilment",
    ],
    certifications: ["HALAL", "GMP", "HACCP", "MeSTI"],
    oem: true,
    exports: [],
    brands: ["IZZLY"],
    bestSellers: ["Flakes White Rice", "Instant White Rice"],
    featured: {
      name: "Cheese Powder",
      description:
        "Serbuk Keju IZZLY diperbuat daripada 100% keju berkualiti, diproses menjadi serbuk halus untuk memudahkan penyediaan pelbagai hidangan — sesuai sebagai penambah rasa dalam bubur, pasta, sup dan masakan keluarga.",
      benefits: [
        "Rich & creamy cheese taste",
        "Easy to use and store",
        "Consistent flavour quality",
        "Long shelf life",
      ],
    },
   gallery: [
      { label: "Factory",src: "/companies/Izzly/factory-1.webp"},
      { label: "Factory",src: "/companies/Izzly/factory-2.webp"},
      { label: "Production line",src: "/companies/Izzly/production-line-1.webp"},
      { label: "Production line",src: "/companies/Izzly/production-line-2.webp"},
      { label: "Products", src: "/companies/Izzly/products-1.webp" },
    ],
    contact: {
      person: null,
      email: "admin@izzly.net",
      whatsapp: "010-657 3164",
      phone: "03-6263 5954",
      socials: [
        { kind: "Instagram", handle: "@izzly_hq" },
        { kind: "TikTok", handle: "@izzly.hq" },
        { kind: "Facebook", handle: "Izzly HQ" },
      ],
    },
  },
  {
    id: "pawada",
    name: "PAWADA",
    legalName: "Pawa Canning Corporation (Malaysia) Sdn Bhd",
    regNo: "200901003187",
    lot: "03",
    founded: "1983",
    category: "Canned Food & Sauces",
    hue: "#8C1F28",
    logo: "/companies/pawada/logo.png",
    tagline: "A Sarawak household name since 1983 — from soya sauce to 60+ SKUs exported worldwide.",
    background:
      "PAWADA is a renowned household brand from the Borneo island of Sarawak. Established in 1983 and initially focused on soya sauce, the indigenous brand has expanded to over 60 SKUs produced in two automated manufacturing facilities. PAWADA products are widely available throughout Malaysia and exported worldwide.",
    vision: "Nourishing a wholesome life.",
    mission: [
      "To be the number one Halal food product manufacturer producing nutritious, quality and natural food products for our global consumers.",
    ],
    coreValues: ["Progressive", "Assurance", "Wholesome", "Attractive", "Dedication", "Ambitious"],
    whyChooseUs: ["No. 1 manufacturer for Halal quality food products delivering great value to consumers"],
    certifications: ["HALAL", "GMP", "HACCP", "ISO 22000", "MeSTI", "VHC"],
    oem: true,
    exports: ["Brunei", "Oman", "Guyana", "UAE"],
    brands: ["PAWADA"],
    bestSellers: ["Corned Beef"],
    featured: {
      name: "PAWADA Range",
      description:
        "Corned beef, corned chicken, pepper powder, sauces, artificial vinegar and a range of soya sauces — for household use and the food service industry, with OEM labelling for businesses.",
      benefits: ["Ready to eat", "Ready to cook", "Easy travel"],
    },
    gallery: [
      { label: "Factory",src: "/companies/pawada/factory-1.webp"},
      { label: "Factory",src: "/companies/pawada/factory-2.webp"},
      { label: "Production line",src: "/companies/pawada/production-line-1.webp"},
      { label: "Production line",src: "/companies/pawada/production-line-2.webp"},
      { label: "Production line",src: "/companies/pawada/production-line-3.webp"},
      { label: "Products", src: "/companies/pawada/product-1.webp" },
      { label: "Products", src: "/companies/pawada/product-2.webp" },
      { label: "Products", src: "/companies/pawada/product-3.webp" },
    ],
    contact: {
      person: "Siti Ayshah",
      email: "ayshah.pawada@gmail.com",
      whatsapp: "012-859 7884",
      phone: "03-6185 6899",
      socials: [
        { kind: "Website", handle: "pawada.com.my", url: "https://www.pawada.com.my" },
        { kind: "Facebook", handle: "Corned Beef Pawada" },
        { kind: "Instagram", handle: "Pawada Official" },
      ],
      shops: [
        { kind: "Shopee", url: "https://shopee.com.my/azasafarida" },
        { kind: "Lazada", url: "https://www.lazada.com.my/shop/pawadaofficial" },
        { kind: "TikTok Shop", url: "https://vt.tiktok.com/ZS9F7s8mv/?page=TikTokShop" },
        { kind: "PG Mall", url: "https://pgmall.my/p/MEA3/0512/pawadaofficial" },
      ],
    },
  },
  {
    id: "nureys",
    name: "Nureys Food",
    legalName: "Nureys Food Sdn Bhd",
    regNo: "201901044512",
    lot: "08",
    founded: "1987",
    category: "Dry Foods & Condiments",
    hue: "#1E4D3B",
    logo: "/companies/nureys/logo.png",
    tagline: "Trusted since 1987 — spices, noodles and crackers in major retail chains and four export markets.",
    background:
      "Founded in 1987 in Taman Melawati, Kuala Lumpur, by Tuan Haji Mohd Kamal bin Abdul Rahman, Nureys Food is a leading Malaysian manufacturer and distributor of Halal food products — spices, condiments, noodles, crackers and frozen foods, all certified Halal by JAKIM. Since 1989, Nureys products have been available in major retail chains across Malaysia and exported internationally.",
    vision:
      "To be a leading and trusted Halal food manufacturer, delivering quality Malaysian food products locally and globally.",
    mission: [
      "Produce and distribute high-quality, Halal-certified food products that preserve authentic flavours and meet the highest standards of quality and safety.",
    ],
    coreValues: ["Halal Integrity", "Quality Excellence", "Trust", "Innovation", "Heritage and Tradition"],
    whyChooseUs: [
      "Nearly four decades of manufacturing experience",
      "JAKIM Halal certified across every product",
      "Wide range: spices, condiments, noodles, crackers, frozen foods",
      "Strong presence in major Malaysian retail chains",
    ],
    certifications: ["HALAL"],
    oem: true,
    exports: ["Hong Kong", "Saudi Arabia", "Singapore", "Ireland"],
    brands: ["Nureys"],
    bestSellers: ["Rice Vermicelli", "Laksa Noodles", "Fried Shallots", "Lentil Crackers", "Vegetable Crackers"],
    featured: null,
    gallery: [
      { label: "Factory", src:"/companies/nureys/factory-1.webp"},
      { label: "Products", src:"/companies/nureys/product-1.webp" },
      { label: "Products", src:"/companies/nureys/product-2.webp" },
      { label: "Products", src:"/companies/nureys/product-3.webp" },
      { label: "Products", src:"/companies/nureys/product-4.webp" },
      { label: "Products", src:"/companies/nureys/product-5.webp" },

    ],
    contact: {
      person: "Mohd Imran Mohd Kamal",
      email: "admin@nureys.com.my",
      whatsapp: "016-202 0351",
      phone: "03-6178 9799",
      socials: [
        { kind: "Website", handle: "nureys.com.my" },
        { kind: "Facebook", handle: "Nureys" },
        { kind: "Instagram", handle: "Nureys" },
      ],
    },
  },
  {
    id: "fatihah",
    name: "Fatihah Frozen Food",
    legalName: "Fatihah Frozen Food Sdn Bhd",
    regNo: "295115-P",
    lot: "12",
    founded: "1994",
    category: "Frozen Food",
    hue: "#123A5C",
    logo: "/companies/fatihah/logo.png",
    tagline: "Frozen paratha, roti canai and pastries — retail and HORECA, exported across Asia.",
    background:
      "FATIHAH specialises in manufacturing and supplying frozen Asian delicacies such as paratha, roti canai, curry puff, samosa and spring roll — high quality, rich in taste and freshness, supported by HALAL, GMP, HACCP and ISO 22000 standards. Believing innovation is the key to growth, FATIHAH is diversifying into ready-to-cook frozen homemade pastry.",
    vision:
      "To be a well-known brand producing halal, good-quality frozen food for the Malaysian and global market.",
    mission: [
      "Provide quality and tasty products to consumers.",
      "Promote our brand to the Malaysian and global market.",
      "Deliver new innovative products that appeal to the market.",
    ],
    coreValues: ["Halal", "Convenient", "Quality Frozen Food"],
    whyChooseUs: ["Suitable for retail and HORECA", "Fast-moving products", "Long shelf life"],
    certifications: ["HALAL", "GMP", "HACCP", "ISO 22000", "MeSTI"],
    oem: true,
    exports: ["Thailand", "Singapore", "Hong Kong"],
    brands: ["FATIHAH"],
    bestSellers: ["Paratha Series (Paratha / Chapatti / Roti Canai / Roti Boom)"],
    featured: {
      name: "Paratha Original",
      description:
        "Soft, flaky paratha made from quality ingredients, perfect for quick meals. Range includes Paratha Original, Roti Canai, Roti Boom, Curry Puff and Spring Roll.",
      benefits: ["Traditional authentic taste", "Fresh ingredients", "Value for money"],
    },
    gallery: [
      { label: "Factory", src:"/companies/fatihah/factory-1.webp" },
      { label: "Production line",src:"/companies/fatihah/production-line-1.webp"},
      { label: "Production line",src:"/companies/fatihah/production-line-2.webp"},
      { label: "Products", src:"/companies/fatihah/product-1.webp"},
      { label: "Products", src:"/companies/fatihah/product-2.webp"},
      { label: "Products", src:"/companies/fatihah/product-3.webp"},
      { label: "Products", src:"/companies/fatihah/product-4.webp"},
      { label: "Products", src:"/companies/fatihah/product-5.webp"},
    ],
    contact: {
      person: "Hazirah Che Hasim",
      email: "hello@fatihahfrozenfood.my",
      whatsapp: "012-631 3105",
      phone: "03-6185 6690",
      socials: [
        { kind: "Website", handle: "fatihahfrozenfood.my", url: "https://www.fatihahfrozenfood.my" },
        { kind: "Facebook", handle: "FatihahFrozenFoodMalaysia" },
        { kind: "Instagram", handle: "@fatihah_frozenfood" },
        { kind: "TikTok", handle: "@fatihahfrozenfood" },
      ],
    },
  },
  {
    id: "callabio",
    name: "Callabio Manufacturing",
    legalName: "Callabio Manufacturing Sdn Bhd",
    regNo: "202101022414 (1422714-A)",
    lot: "13",
    founded: "2021",
    category: "Beverages & Supplements",
    hue: "#27476E",
    logo:"/companies/callabio/logo.png",
    tagline:
      "OEM manufacturer of café syrups, beverages and health supplements — from Malaysia, for the world.",
    background:
      "Callabio Manufacturing is a 100% Bumiputera-owned company specialising in the development and manufacturing of OEM products spanning food & beverages, health supplements, collagen-based products, hair care and cosmetics. With extensive industry experience, Callabio helps clients build high-quality, market-ready products — from formulation to final packaging.",
    vision: "For our brand and services to be known globally.",
    mission: [
      "Deliver the best to clients and partners through a wide range of high-quality products and services, helping clients grow their brands with trusted, innovative, market-ready offerings.",
    ],
    coreValues: ["Trust", "Loyalty", "Integrity"],
    whyChooseUs: ["Cheaper and reliable"],
    certifications: ["HALAL", "GMP", "HACCP", "MeSTI", "FDA"],
    oem: true,
    exports: ["United States"],
    brands: ["Bariistar", "Schildmed", "Kakwa Kordial", "Shahir Coffee"],
    bestSellers: ["Kakwa Kordial"],
    featured: {
      name: "Bariistar",
      description: "Syrups, sauces & cafe supplies.",
      benefits: ["Low-cost and premium taste, made for experienced baristas"],
    },
    gallery: [
      { label: "Factory", src:"/companies/callabio/factory-1.webp" },
      { label: "Products",src:"/companies/callabio/product-1.webp" },
      { label: "Products",src:"/companies/callabio/product-2.webp" },
      { label: "Products",src:"/companies/callabio/product-3.webp" },
      { label: "Products",src:"/companies/callabio/product-4.webp" },
      { label: "Products",src:"/companies/callabio/product-5.webp" },
      { label: "Products",src:"/companies/callabio/product-6.webp" },
    ],
    contact: {
      person: "En Amir Muttaqin Mohamad Noh",
      email: "callabiopurchaser@gmail.com",
      whatsapp: "011-6262 3515",
      phone: null,
      socials: [
        { kind: "Website", handle: "callabio.com", url: "https://www.callabio.com/" },
      ],
    },
  },
  {
    id: "pfi",
    name: "PFI Worldwide",
    legalName: "PFI Worldwide Sdn Bhd",
    regNo: "748639-W",
    lot: "16",
    founded: "2012",
    category: "Snacks & Beverages",
    hue: "#4A2C57",
    logo: "/companies/pfi/logo.png",
    tagline: "Pengilang makanan ringan PESONA — kerepek, biskut dan minuman kesihatan Glow D.",
    background:
      "Pengilang dan pengeluar produk makanan ringan seperti kerepek ubi kayu, biskut dan keropok, selain pembuatan produk makanan ready-to-eat.",
    vision:
      "Menjadi peneraju industri makanan dengan menghasilkan produk yang berkualiti tinggi, selamat, halal dan memenuhi kepuasan pengguna.",
    mission: [
      "Menghasilkan produk makanan yang berkualiti tinggi, selamat, halal dan memenuhi piawaian keselamatan makanan yang diiktiraf.",
    ],
    coreValues: ["Kualiti Terjamin", "Inovasi Berterusan"],
    whyChooseUs: [
      "Rakan pilihan dalam industri makanan — produk berkualiti, selamat dan inovatif dengan nilai terbaik.",
    ],
    certifications: ["HALAL", "GMP", "MeSTI"],
    oem: true,
    exports: [],
    brands: ["PESONA"],
    bestSellers: ["Kerepek Ubi Kayu", "Biskut Semperit"],
    featured: {
      name: "Glow D — Nektar Buah-Buahan",
      description:
        "Minuman kesihatan tambahan untuk gaya hidup sibuk — dibangunkan daripada buah-buahan tempatan yang kaya dengan pigmen antosianin dan betasianin sebagai sumber antioksidan utama.",
      benefits: ["Kaya antioksidan", "Membantu mengekalkan gaya hidup sihat"],
    },
    gallery: [
      { label: "Factory", src:"/companies/pfi/factory-2.webp" },
      { label: "Production line", src:"/companies/pfi/product-line-1.webp"},
      { label: "Production line", src:"/companies/pfi/product-line-2.webp"},
      { label: "Production line", src:"/companies/pfi/product-line-3.webp"},
      { label: "Warehouse", src:"/companies/pfi/office-1.webp"},
      { label: "Laboratory", src:"/companies/pfi/lab-1.webp" },
      { label: "Products", src:"/companies/pfi/product-1.webp" },
      { label: "Products", src:"/companies/pfi/product-2.webp"},
    ],
    contact: {
      person: "Dr Fatimah Sham Abdullah",
      email: "whypesona@gmail.com",
      whatsapp: "016-309 3333",
      phone: "011-2305 3573",
      socials: [{ kind: "TikTok", handle: "PFI Worldwide" }],
    },
  },
  {
    id: "sejuk",
    name: "Cremiu Ice Cream",
    legalName: "Sejuk Confectionery Sdn Bhd",
    regNo: "201801040840",
    lot: "17",
    founded: "2018",
    category: "Ice Cream",
    hue: "#0E5C6B",
    logo: "/companies/sejuk/logo.png",
    tagline: "Japan-inspired ice cream for retail, HORECA and OEM.",
    background: "Ice cream confectionery manufacturer for retail, HORECA and OEM.",
    vision: null,
    mission: [],
    coreValues: [
      "Create unique products",
      "Be trendsetters",
      "Embrace technology & change",
      "Empower employees",
    ],
    whyChooseUs: ["Unique products with premium quality at a reasonable price point"],
    certifications: ["HALAL", "MeSTI"],
    oem: true,
    exports: ["Singapore"],
    brands: ["Cremiu Ice Cream"],
    bestSellers: ["Cremiu Monaka", "Cremiu Baton", "5L Tub — Japanese Flavours"],
    featured: {
      name: "Cremiu Ice Cream",
      description: "Japan-inspired ice cream.",
      benefits: [],
    },
    gallery: [
       { label: "Factory", src: "/companies/sejuk/factory-1.webp" },
      { label: "Products", src: "/companies/sejuk/product-1.webp" },
      { label: "Products", src: "/companies/sejuk/product-2.webp" },
      { label: "Products", src: "/companies/sejuk/product-3.webp" },
      { label: "Products", src: "/companies/sejuk/product-4.webp" },
    ],
    contact: {
      person: "Eizanur",
      email: "sales@sejuk-ice.com",
      whatsapp: "019-274 5131",
      phone: null,
      socials: [
        { kind: "Website", handle: "cremiu.com", url: "https://www.cremiu.com" },
        { kind: "Facebook / IG", handle: "@icecremiu" },
      ],
    },
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(COMPANIES.map((c) => c.category)))];

const waLink = (num) => (num ? "https://wa.me/6" + num.replace(/[^0-9]/g, "") : null);
const initials = (name) => name.split(" ").slice(0, 2).map((w) => w[0]).join("");

export default function MhipDirectory() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = COMPANIES.filter(
    (c) =>
      (cat === "All" || c.category === cat) &&
      (c.name + c.legalName + c.category + c.brands.join(" "))
        .toLowerCase()
        .includes(query.toLowerCase())
  );
  const company = COMPANIES.find((c) => c.id === selected);

  return (
    <div className="mh-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Archivo:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .mh-root {
          --paper: #F6F7F3; --ink: #15241E; --muted: #5E6B64;
          --line: #D9DED6; --accent: #C0382B; --leaf: #1E5C41;
          background: var(--paper); color: var(--ink); min-height: 100vh;
          font-family: 'Archivo', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        .mh-wrap { max-width: 1060px; margin: 0 auto; padding: 0 24px 96px; }

        .mh-header {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 12px; padding: 28px 0 20px; border-bottom: 2px solid var(--ink);
        }
        .mh-mark { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 22px; letter-spacing: -0.02em; }
        .mh-mark .dot { color: var(--accent); }
        .mh-header-meta { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--muted); letter-spacing: 0.06em; text-transform: uppercase; }

        .mh-hero { padding: 52px 0 36px; border-bottom: 1px solid var(--line); }
        .mh-hero h1 { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; letter-spacing: -0.03em; line-height: 0.98; font-size: clamp(40px, 6.5vw, 76px); margin: 0; }
        .mh-hero h1 em { font-style: normal; color: var(--leaf); }
        .mh-hero p { max-width: 560px; margin: 20px 0 0; color: var(--muted); font-size: 16px; line-height: 1.6; }

        .mh-controls { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; padding: 24px 0 20px; }
        .mh-search { flex: 1 1 240px; max-width: 320px; background: transparent; border: 1px solid var(--ink); border-radius: 999px; padding: 10px 18px; font-family: inherit; font-size: 14px; color: var(--ink); outline: none; }
        .mh-search:focus-visible { box-shadow: 0 0 0 3px rgba(192,56,43,0.25); }
        .mh-search::placeholder { color: var(--muted); }
        .mh-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .mh-chip { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; letter-spacing: 0.03em; text-transform: uppercase; padding: 7px 13px; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--muted); cursor: pointer; transition: all .15s ease; }
        .mh-chip:hover { border-color: var(--ink); color: var(--ink); }
        .mh-chip:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .mh-chip.active { background: var(--ink); color: var(--paper); border-color: var(--ink); }

        .mh-count { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--muted); letter-spacing: .06em; text-transform: uppercase; margin: 0 0 12px; }

        .mh-grid { display: grid; gap: 1px; background: var(--line); border: 1px solid var(--line); grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr)); }
        .mh-card { background: var(--paper); text-align: left; cursor: pointer; border: none; padding: 24px 22px 20px; position: relative; display: flex; flex-direction: column; gap: 16px; font-family: inherit; color: inherit; transition: background .18s ease; animation: mhRise .5s ease both; }
        .mh-card:hover { background: #fff; }
        .mh-card:focus-visible { outline: 3px solid var(--accent); outline-offset: -3px; z-index: 1; }
        .mh-tile { width: 52px; height: 52px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 19px; color: #F6F7F3; overflow: hidden; border: 1px solid var(--line); }
        .mh-tile img { width: 100%; height: 100%; object-fit: contain; padding: 4px; box-sizing: border-box; }
        .mh-photo { aspect-ratio: 4/3; width: 100%; object-fit: cover; border-radius: 8px; border: 1px solid var(--line); display: block; }
        .mh-card h3 { margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 600; font-size: 19px; letter-spacing: -0.01em; }
        .mh-card .sub { margin-top: 4px; font-size: 13px; color: var(--muted); }
        .mh-badges-mini { display: flex; flex-wrap: wrap; gap: 5px; }
        .mh-badge-mini { font-family: 'IBM Plex Mono', monospace; font-size: 9.5px; letter-spacing: .04em; padding: 3px 7px; border: 1px solid var(--line); border-radius: 4px; color: var(--muted); }
        .mh-card-foot { margin-top: auto; display: flex; justify-content: space-between; align-items: center; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: .05em; color: var(--muted); }
        .mh-card-foot .lot { color: var(--accent); font-weight: 500; }
        .mh-card .arrow { position: absolute; top: 22px; right: 20px; font-size: 16px; color: var(--line); transition: all .18s ease; }
        .mh-card:hover .arrow { color: var(--accent); transform: translate(3px, -3px); }

        .mh-back { background: none; border: none; cursor: pointer; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); padding: 0; margin: 30px 0 0; }
        .mh-back:hover { color: var(--accent); }
        .mh-back:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

        .mh-detail { position: relative; padding: 36px 0 0; animation: mhRise .45s ease both; }
        .mh-watermark-logo { position: absolute; top: 8px; right: 0; width: clamp(130px, 22vw, 240px); max-height: 220px; object-fit: contain; opacity: 0.16; pointer-events: none; user-select: none; }
        .mh-eyebrow { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
        .mh-eyebrow .lot { color: var(--accent); font-weight: 500; }
        .mh-detail h2 { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(36px, 6vw, 64px); letter-spacing: -0.03em; line-height: 1.02; margin: 14px 0 4px; position: relative; }
        .mh-detail .legal { color: var(--muted); font-size: 14px; margin: 0; font-family: 'IBM Plex Mono', monospace; }
        .mh-detail .tagline { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 600; font-size: 19px; margin: 20px 0 0; max-width: 580px; line-height: 1.4; position: relative; }

        .mh-badges { display: flex; flex-wrap: wrap; gap: 8px; margin: 22px 0 0; position: relative; }
        .mh-badge { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: .05em; padding: 6px 12px; border: 1.5px solid var(--leaf); border-radius: 6px; color: var(--leaf); font-weight: 500; }
        .mh-badge.oem { border-color: var(--accent); color: var(--accent); }

        .mh-facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1px; background: var(--line); border: 1px solid var(--line); margin: 30px 0; }
        .mh-fact { background: var(--paper); padding: 15px 17px; }
        .mh-fact .k { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
        .mh-fact .v { margin-top: 6px; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 600; font-size: 16px; }

        .mh-section { margin: 34px 0 0; max-width: 680px; }
        .mh-section h4 { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--accent); margin: 0 0 10px; font-weight: 500; }
        .mh-section p { margin: 0; font-size: 15.5px; line-height: 1.7; color: #2A3832; }
        .mh-section ul { margin: 0; padding-left: 20px; font-size: 15.5px; line-height: 1.75; color: #2A3832; }
        .mh-values { display: flex; flex-wrap: wrap; gap: 8px; }
        .mh-value { font-size: 13px; padding: 6px 13px; background: #fff; border: 1px solid var(--line); border-radius: 999px; }

        .mh-featured { margin: 34px 0 0; border: 2px solid var(--ink); padding: 24px; max-width: 680px; background: #fff; }
        .mh-featured h4 { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--accent); margin: 0 0 8px; font-weight: 500; }
        .mh-featured h5 { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 24px; margin: 0 0 10px; letter-spacing: -0.01em; }
        .mh-featured p { margin: 0; font-size: 15px; line-height: 1.65; color: #2A3832; }
        .mh-featured ul { margin: 12px 0 0; padding-left: 20px; font-size: 14px; line-height: 1.7; color: var(--muted); }

        .mh-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 4px; max-width: 680px; }
        .mh-ph { aspect-ratio: 4/3; border: 1px dashed var(--line); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: var(--muted); background: rgba(255,255,255,.5); }
        .mh-ph .n { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 22px; color: var(--line); }
        .mh-ph .l { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: .06em; text-transform: uppercase; }
        .mh-gallery-note { font-size: 12.5px; color: var(--muted); margin: 10px 0 0; font-style: italic; }

        .mh-contact { margin: 40px 0 0; border-top: 2px solid var(--ink); padding-top: 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; max-width: 680px; }
        .mh-contact .k { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
        .mh-contact a { color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--accent); font-size: 14.5px; }
        .mh-contact a:hover { color: var(--accent); }
        .mh-contact .plain { font-size: 14.5px; }
        .mh-contact div p { margin: 0 0 4px; }

        .mh-next { margin-top: 48px; padding-top: 22px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; gap: 16px; }
        .mh-nav-btn { background: none; border: none; cursor: pointer; padding: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 600; font-size: 16px; color: var(--ink); }
        .mh-nav-btn span { color: var(--accent); }
        .mh-nav-btn:hover { color: var(--accent); }
        .mh-nav-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

        .mh-empty { padding: 64px 0; text-align: center; color: var(--muted); font-size: 15px; }

        @keyframes mhRise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          .mh-card, .mh-detail { animation: none; }
          .mh-card, .mh-chip, .mh-card .arrow { transition: none; }
        }

        /* ───────── tablet and below ───────── */
        @media (max-width: 768px) {
          .mh-wrap { padding: 0 18px 72px; }
          .mh-hero { padding: 40px 0 28px; }
          .mh-facts { grid-template-columns: repeat(2, 1fr); }
          .mh-featured { padding: 20px 18px; }
          .mh-watermark { top: 0; right: -4px; font-size: clamp(90px, 26vw, 160px); }
          .mh-watermark-logo { top: 4px; width: clamp(90px, 26vw, 150px); max-height: 140px; }
        }

        /* ───────── phones ───────── */
        @media (max-width: 560px) {
          .mh-header { flex-direction: column; align-items: flex-start; gap: 4px; padding: 20px 0 14px; }
          .mh-hero h1 br { display: none; }
          .mh-hero p { font-size: 15px; }

          /* search goes full-width; chips become one swipeable row */
          .mh-controls { padding: 18px 0 14px; }
          .mh-search { flex-basis: 100%; max-width: none; }
          .mh-chips {
            flex-wrap: nowrap; overflow-x: auto; width: 100%;
            padding-bottom: 6px; -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .mh-chips::-webkit-scrollbar { display: none; }
          .mh-chip { flex: 0 0 auto; padding: 9px 14px; }

          .mh-card { padding: 20px 18px 16px; }
          .mh-detail h2 { font-size: clamp(30px, 9vw, 40px); }
          .mh-detail .tagline { font-size: 17px; }
          .mh-detail .legal { font-size: 12px; }
          .mh-eyebrow { gap: 8px; font-size: 11px; }
          .mh-section { margin-top: 28px; }
          .mh-section p, .mh-section ul { font-size: 15px; }
          .mh-gallery { grid-template-columns: repeat(2, 1fr); }
          .mh-facts .v { font-size: 15px; }
          .mh-contact { grid-template-columns: 1fr; gap: 16px; }

          /* prev/next stack vertically with full-width tap targets */
          .mh-next { flex-direction: column; gap: 14px; }
          .mh-nav-btn { text-align: left; padding: 4px 0; }
          .mh-nav-btn:last-child { text-align: right; }
        }

        /* comfortable tap targets on any touch device */
        @media (hover: none) {
          .mh-chip { padding: 9px 15px; }
          .mh-back { padding: 6px 0; }
        }
      `}</style>

      <div className="mh-wrap">
        <header className="mh-header">
          <div className="mh-mark">
            MHIP<span className="dot">.</span>DIRECTORY
          </div>
          <div className="mh-header-meta">MARA Halal Industrial Park · Batu Caves, KL</div>
        </header>

        {!company && (
          <>
            <section className="mh-hero">
              <h1>
                Malaysia's halal
                <br />
                makers, <em>one park.</em>
              </h1>
              <p>
                Eight Halal-certified food manufacturers producing from MARA's
                halal manufacturing hub at KM13 Batu Caves — from chocolate and
                ice cream to frozen paratha, café syrups and canned classics.
                Open any profile to explore products, certifications and OEM
                services.
              </p>
            </section>

            <div className="mh-controls">
              <input
                className="mh-search"
                placeholder="Search company or brand…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search companies"
              />
              <div className="mh-chips" role="group" aria-label="Filter by category">
                {CATEGORIES.map((c) => (
                  <button key={c} className={`mh-chip ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <p className="mh-count">
              {filtered.length} of {COMPANIES.length} manufacturers
            </p>

            {filtered.length > 0 ? (
              <div className="mh-grid">
                {filtered.map((c, i) => (
                  <button
                    key={c.id}
                    className="mh-card"
                    style={{ animationDelay: `${i * 0.04}s` }}
                    onClick={() => { setSelected(c.id); window.scrollTo(0, 0); }}
                  >
                    <span className="arrow">↗</span>
                    <div className="mh-tile" style={{ background: c.logo ? "#FFFFFF" : c.hue }}>
                      {c.logo ? (
                        <img src={c.logo} alt={`${c.name} logo`} />
                      ) : (
                        initials(c.name)
                      )}
                    </div>
                    <div>
                      <h3>{c.name}</h3>
                      <div className="sub">{c.category} · Since {c.founded}</div>
                    </div>
                    <div className="mh-badges-mini">
                      {c.certifications.slice(0, 4).map((b) => (
                        <span key={b} className="mh-badge-mini">{b}</span>
                      ))}
                    </div>
                    <div className="mh-card-foot">
                      <span className="lot">{c.lot ? `LOT ${c.lot}` : c.site}</span>
                      <span>{c.oem ? "OEM ✓" : ""}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mh-empty">No manufacturers match "{query}". Clear the search to see all {COMPANIES.length}.</div>
            )}
          </>
        )}

        {company && (
          <>
            <button className="mh-back" onClick={() => setSelected(null)}>
              ← Back to directory
            </button>
            <article className="mh-detail" key={company.id}>
              <div className="mh-watermark">{company.lot ?? company.site}</div>
              {company.logo ? (
                    <img
                      className="mh-watermark-logo"
                      src={company.logo}
                      alt=""
                      aria-hidden="true"
                    />
                  ) : (
                    <div className="mh-watermark">{company.lot ?? company.site}</div>
                  )}

              <div className="mh-eyebrow">
                <span className="lot">{company.lot ? `LOT ${company.lot}` : company.site}</span>
                <span>{company.category}</span>
                <span>{company.lot ? "MHIP Batu Caves" : "KM13 Batu Caves"}</span>
              </div>
              <h2>{company.name}</h2>
              <p className="legal">{company.legalName} · {company.regNo}</p>
              <p className="tagline">{company.tagline}</p>

              <div className="mh-badges">
                {company.certifications.map((b) => (
                  <span key={b} className="mh-badge">{b}</span>
                ))}
                {company.oem && <span className="mh-badge oem">OEM AVAILABLE</span>}
              </div>

              <div className="mh-facts">
                <div className="mh-fact"><div className="k">Established</div><div className="v">{company.founded}</div></div>
                <div className="mh-fact"><div className="k">Brands</div><div className="v">{company.brands.length <= 2 ? company.brands.join(", ") : `${company.brands.length} brands`}</div></div>
                <div className="mh-fact"><div className="k">Export markets</div><div className="v">{company.exports.length > 0 ? `${company.exports.length} countries` : "Domestic"}</div></div>
                <div className="mh-fact"><div className="k">Certifications</div><div className="v">{company.certifications.length}</div></div>
              </div>

              <div className="mh-section">
                <h4>About</h4>
                <p>{company.background}</p>
              </div>

              {company.vision && (
                <div className="mh-section">
                  <h4>Vision</h4>
                  <p>{company.vision}</p>
                </div>
              )}

              {company.mission.length > 0 && (
                <div className="mh-section">
                  <h4>Mission</h4>
                  {company.mission.length === 1 ? (
                    <p>{company.mission[0]}</p>
                  ) : (
                    <ul>{company.mission.map((m, i) => <li key={i}>{m}</li>)}</ul>
                  )}
                </div>
              )}

              {company.coreValues.length > 0 && (
                <div className="mh-section">
                  <h4>Core values</h4>
                  <div className="mh-values">
                    {company.coreValues.map((v) => <span key={v} className="mh-value">{v}</span>)}
                  </div>
                </div>
              )}

              {company.whyChooseUs.length > 0 && (
                <div className="mh-section">
                  <h4>Why choose {company.name}</h4>
                  <ul>{company.whyChooseUs.map((w, i) => <li key={i}>{w}</li>)}</ul>
                </div>
              )}

              {company.exports.length > 0 && (
                <div className="mh-section">
                  <h4>Exported to</h4>
                  <div className="mh-values">
                    {company.exports.map((e) => <span key={e} className="mh-value">{e}</span>)}
                  </div>
                </div>
              )}

              {company.featured && (
                <div className="mh-featured">
                  <h4>Featured product</h4>
                  <h5>{company.featured.name}</h5>
                  {company.featured.description && <p>{company.featured.description}</p>}
                  {company.featured.benefits.length > 0 && (
                    <ul>{company.featured.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul>
                  )}
                </div>
              )}

              {company.bestSellers.length > 0 && (
                <div className="mh-section">
                  <h4>Best sellers</h4>
                  <div className="mh-values">
                    {company.bestSellers.map((b) => <span key={b} className="mh-value">{b}</span>)}
                  </div>
                </div>
              )}

              {company.gallery.length > 0 && (
                <div className="mh-section">
                  <h4>Facility & products</h4>
                  <div className="mh-gallery">
                    {company.gallery.map((g, i) =>
                      g.src ? (
                        <img
                          key={i}
                          src={g.src}
                          alt={`${company.name} — ${g.label}`}
                          className="mh-photo"
                          loading="lazy"
                        />
                      ) : (
                        <div key={i} className="mh-ph">
                          <span className="n">{g.count}</span>
                          <span className="l">{g.label}</span>
                        </div>
                      )
                    )}
                  </div>
                  {company.gallery.some((g) => !g.src) && (
                    <p className="mh-gallery-note">
                      Photo placeholders — swap in the hosted images from the company's Drive folder.
                    </p>
                  )}
                </div>
              )}

              <div className="mh-contact">
                <div>
                  <div className="k">Enquiries</div>
                  {company.contact.person && <p className="plain">{company.contact.person}</p>}
                  <p><a href={`mailto:${company.contact.email}`}>{company.contact.email}</a></p>
                </div>
                <div>
                  <div className="k">WhatsApp / Phone</div>
                  {company.contact.whatsapp && (
                    <p><a href={waLink(company.contact.whatsapp)} target="_blank" rel="noreferrer">{company.contact.whatsapp} (WhatsApp)</a></p>
                  )}
                  {company.contact.phone && <p className="plain">{company.contact.phone}</p>}
                </div>
                <div>
                  <div className="k">Find them online</div>
                  {company.contact.socials.map((s) => (
                    <p key={s.kind} className="plain">
                      {s.url ? <a href={s.url} target="_blank" rel="noreferrer">{s.kind}: {s.handle}</a> : `${s.kind}: ${s.handle}`}
                    </p>
                  ))}
                  {company.contact.shops && company.contact.shops.map((s) => (
                    <p key={s.kind}><a href={s.url} target="_blank" rel="noreferrer">Shop on {s.kind}</a></p>
                  ))}
                </div>
              </div>

              <nav className="mh-next">
                {(() => {
                  const idx = COMPANIES.findIndex((c) => c.id === company.id);
                  const prev = COMPANIES[(idx - 1 + COMPANIES.length) % COMPANIES.length];
                  const next = COMPANIES[(idx + 1) % COMPANIES.length];
                  return (
                    <>
                      <button className="mh-nav-btn" onClick={() => { setSelected(prev.id); window.scrollTo(0, 0); }}>
                        <span>←</span> {prev.name}
                      </button>
                      <button className="mh-nav-btn" onClick={() => { setSelected(next.id); window.scrollTo(0, 0); }}>
                        {next.name} <span>→</span>
                      </button>
                    </>
                  );
                })()}
              </nav>
            </article>
          </>
        )}
      </div>
    </div>
  );
}
