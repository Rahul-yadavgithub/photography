import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Upload, Image as ImageIcon, Type, Eye, ChevronRight, Star, Truck, Shield, Minus, Plus, ShoppingBag, ArrowLeft, CheckCircle2, ChevronDown, Check } from 'lucide-react';

const PRODUCT = {
  id: 1,
  name: "Premium Wedding Album",
  desc: "Handcrafted Italian leather lay-flat album. Every page is thick, durable, and printed with stunning color accuracy to make your memories last generations.",
  price: 299,
  rating: 5,
  reviews: 124,
  images: [
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800"
  ],
  features: ["Premium Italian Leather", "Lay-flat thick pages", "Vibrant archival inks", "Hand-stitched binding"]
};

const SIZES = [
  { id: 'S', name: 'Small (8x8")', price: 0 },
  { id: 'M', name: 'Medium (10x10")', price: 50 },
  { id: 'L', name: 'Large (12x12")', price: 100 },
  { id: 'XL', name: 'Luxury (14x14")', price: 150 },
];

const MATERIALS = [
  { id: 'leather', name: 'Genuine Leather' },
  { id: 'linen', name: 'Premium Linen' },
  { id: 'acrylic', name: 'Acrylic Cover' },
];

const FAQS = [
  { q: "How long does delivery take?", a: "Customized products typically take 7-10 business days to manufacture and ship." },
  { q: "What image quality is recommended?", a: "For best print results, we recommend high-resolution JPEG or PNG files over 2MB." },
  { q: "Can I preview before purchase?", a: "Yes! Our Live Preview tool shows exactly how your product will look." },
];

const WorkspaceStep = ({ number, title, active, completed, onClick }) => (
  <div onClick={onClick} className={`flex items-center p-4 cursor-pointer transition-colors ${active ? 'bg-white shadow-md border border-gray-200 rounded-xl' : 'hover:bg-gray-50'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4 transition-colors ${active ? 'bg-[#ea580c] text-white' : completed ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
      {completed && !active ? <Check className="w-5 h-5" /> : number}
    </div>
    <div className="flex-grow">
      <h4 className={`font-semibold ${active ? 'text-gray-900' : 'text-gray-600'}`}>{title}</h4>
    </div>
  </div>
);

export default function ProductDetailPage() {
  const { id } = useParams();
  const fileInputRef = useRef(null);
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Customization State
  const [step, setStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);
  const [personalMessage, setPersonalMessage] = useState("");
  const [isQualityGood, setIsQualityGood] = useState(true);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setIsQualityGood(file.size > 100000); // Mock quality check
      setStep(2);
    }
  };

  const currentPrice = PRODUCT.price + selectedSize.price;

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans w-full text-gray-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link to="/store" className="hover:text-[#ea580c] transition-colors">Store</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>Albums</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">{PRODUCT.name}</span>
        </div>

        {/* Top Section: Product Details & Customization Workspace */}
        <div className="flex flex-col lg:flex-row gap-12 mb-24">
          
          {/* Left Column: Gallery & Live Preview */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 aspect-square relative">
              {/* LIVE PREVIEW LOGIC */}
              {step === 5 && uploadedImage ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gray-100">
                  <div className="relative shadow-2xl bg-white p-4 pb-12 w-3/4 aspect-[4/3] rotate-[-2deg] transition-all duration-700">
                     <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover" />
                     {personalMessage && (
                       <p className="absolute bottom-4 left-0 w-full text-center font-serif text-gray-800 text-lg">{personalMessage}</p>
                     )}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md text-xs font-bold uppercase tracking-widest flex items-center">
                    <Eye className="w-4 h-4 mr-2" /> Live Preview
                  </div>
                </div>
              ) : (
                <img src={PRODUCT.images[activeImage]} alt={PRODUCT.name} className="w-full h-full object-cover" />
              )}
            </div>
            
            <div className="flex space-x-4">
              {PRODUCT.images.map((img, idx) => (
                <button key={idx} onClick={() => { setActiveImage(idx); setStep(1); }} className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx && step !== 5 ? 'border-[#ea580c] shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
              {uploadedImage && (
                <button onClick={() => setStep(5)} className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center bg-gray-100 ${step === 5 ? 'border-[#ea580c] shadow-lg text-[#ea580c]' : 'border-transparent opacity-60 hover:opacity-100 text-gray-500'}`}>
                  <Eye className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center">Preview<br/>Mockup</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Customization Flow */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h1 className="text-4xl font-serif text-gray-900 mb-2">{PRODUCT.name}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <span className="text-sm text-gray-500 underline cursor-pointer">{PRODUCT.reviews} Reviews</span>
            </div>
            
            <p className="text-gray-600 mb-8 leading-relaxed">{PRODUCT.desc}</p>
            
            {/* Customization Workspace Wrapper */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-serif text-xl">Customization Workspace</h3>
                <span className="text-3xl font-bold text-gray-900">${currentPrice}</span>
              </div>

              {/* Step Navigation Sidebar/Top */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
                <WorkspaceStep number={1} title="Upload" active={step === 1} completed={step > 1} onClick={() => setStep(1)} />
                <WorkspaceStep number={2} title="Variant" active={step === 2} completed={step > 2} onClick={() => setStep(2)} />
                <WorkspaceStep number={3} title="Message" active={step === 3} completed={step > 3} onClick={() => setStep(3)} />
                <WorkspaceStep number={4} title="Review" active={step === 5} completed={step > 5} onClick={() => setStep(5)} />
              </div>

              {/* Step Content Area */}
              <div className="flex-grow bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                
                {/* STEP 1: UPLOAD */}
                {step === 1 && (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#ea580c] hover:bg-[#ea580c]/5 transition-colors group"
                    >
                      <Upload className="w-10 h-10 text-gray-400 group-hover:text-[#ea580c] mb-4 transition-colors" />
                      <p className="font-bold text-gray-700">Click or Drag & Drop Photos</p>
                      <p className="text-xs text-gray-500 mt-2">JPEG, PNG, WEBP (Max 20MB)</p>
                    </div>
                    {uploadedImage && (
                      <div className="mt-4 flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-full">
                        <CheckCircle2 className="w-4 h-4" /> <span>Image uploaded successfully</span>
                      </div>
                    )}
                    <button onClick={() => setStep(2)} className="mt-8 w-full py-4 bg-gray-900 text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-[#ea580c] transition-colors">
                      Continue to Variants
                    </button>
                  </div>
                )}

                {/* STEP 2: VARIANTS */}
                {step === 2 && (
                  <div className="animate-in fade-in duration-300">
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">Select Size</label>
                      <div className="grid grid-cols-2 gap-3">
                        {SIZES.map(s => (
                          <div 
                            key={s.id} 
                            onClick={() => setSelectedSize(s)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedSize.id === s.id ? 'border-[#ea580c] bg-[#ea580c]/5 ring-1 ring-[#ea580c]' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                            <div className="font-medium text-gray-900">{s.name}</div>
                            <div className="text-sm text-gray-500">{s.price > 0 ? `+$${s.price}` : 'Included'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mb-8">
                      <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">Cover Material</label>
                      <div className="flex flex-wrap gap-3">
                        {MATERIALS.map(m => (
                          <div 
                            key={m.id} 
                            onClick={() => setSelectedMaterial(m)}
                            className={`px-4 py-2 border rounded-full cursor-pointer text-sm font-medium transition-all ${selectedMaterial.id === m.id ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}
                          >
                            {m.name}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => setStep(3)} className="w-full py-4 bg-gray-900 text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-[#ea580c] transition-colors">
                      Continue to Personalization
                    </button>
                  </div>
                )}

                {/* STEP 3: MESSAGE */}
                {step === 3 && (
                  <div className="animate-in fade-in duration-300 h-full flex flex-col">
                    <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-3">Add Personal Message (Optional)</label>
                    <p className="text-xs text-gray-500 mb-4">This text will be engraved or printed on the cover of your product.</p>
                    <textarea 
                      value={personalMessage}
                      onChange={(e) => setPersonalMessage(e.target.value)}
                      placeholder="E.g., Rahul & Priya, Forever Together..."
                      className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-[#ea580c] focus:border-transparent outline-none resize-none h-32 text-gray-900"
                    ></textarea>
                    
                    <button onClick={() => setStep(5)} className="mt-auto w-full py-4 bg-gray-900 text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-[#ea580c] transition-colors">
                      Generate Live Preview
                    </button>
                  </div>
                )}

                {/* STEP 5: REVIEW & ADD TO CART */}
                {step === 5 && (
                  <div className="animate-in fade-in duration-300">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full"><Eye className="w-5 h-5 text-blue-600" /></div>
                      <div>
                        <h4 className="font-bold text-blue-900">Live Preview Generated</h4>
                        <p className="text-sm text-blue-700 mt-1">Look at the image on the left to see exactly how your customized product will look!</p>
                      </div>
                    </div>

                    {!isQualityGood && uploadedImage && (
                      <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-red-700 text-sm flex items-start space-x-2">
                        <span className="font-bold">⚠️ Warning:</span> 
                        <span>Your uploaded image resolution is low. Our AI enhancement will automatically try to upscale it before printing.</span>
                      </div>
                    )}

                    <div className="border-t border-b border-gray-200 py-4 mb-6 space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Base Price</span><span className="font-medium">${PRODUCT.price}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Size: {selectedSize.name}</span><span className="font-medium">+{selectedSize.price}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-500">Material: {selectedMaterial.name}</span><span className="font-medium">Included</span></div>
                      {personalMessage && <div className="flex justify-between text-sm"><span className="text-gray-500">Custom Engraving</span><span className="font-medium">Free</span></div>}
                    </div>

                    <div className="flex space-x-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-gray-500 hover:text-gray-900"><Minus className="w-4 h-4" /></button>
                        <span className="w-8 text-center font-bold text-gray-900">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-gray-500 hover:text-gray-900"><Plus className="w-4 h-4" /></button>
                      </div>
                      <button className="flex-grow flex items-center justify-center bg-[#ea580c] text-white rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-[#c2410c] transition-colors shadow-lg">
                        <ShoppingBag className="w-5 h-5 mr-3" />
                        Add to Cart - ${currentPrice * quantity}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Quick Badges */}
            <div className="flex items-center space-x-8 mt-8 text-sm text-gray-600">
              <div className="flex items-center"><Truck className="w-5 h-5 mr-2 text-gray-400" /> Free Global Shipping</div>
              <div className="flex items-center"><Shield className="w-5 h-5 mr-2 text-gray-400" /> Lifetime Guarantee</div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Info, Reviews, FAQ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-gray-200 pt-24">
          
          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-serif text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif text-gray-900">Customer Reviews</h2>
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400"><Star className="w-5 h-5 fill-current" /></div>
                <span className="font-bold text-xl">5.0</span>
                <span className="text-gray-500">({PRODUCT.reviews})</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?img=${i+10}`} alt="User" />
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900">Sarah M.</h5>
                        <p className="text-xs text-gray-500">Verified Buyer • 2 weeks ago</p>
                      </div>
                    </div>
                    <div className="flex text-yellow-400"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
                  </div>
                  <p className="text-gray-600 text-sm">"Absolutely stunning quality. The leather is premium and the print resolution on the thick pages brought our wedding photos back to life. The customization tool was so easy to use!"</p>
                </div>
              ))}
              <button className="w-full py-4 border border-gray-300 text-gray-900 rounded font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors">
                Load More Reviews
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
