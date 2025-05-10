import React, { useState, useEffect } from "react";
import { useFireproof } from "use-fireproof";
import { callAI } from "call-ai";

export default function TechRepairHomePage() {
  const { database, useLiveQuery, useDocument } = useFireproof("tech-repair-shop");
  
  // Form state for contact request
  const { doc: contactRequest, merge: updateRequest, submit: submitRequest } = useDocument({
    type: "contact-request",
    name: "",
    phone: "",
    email: "",
    message: "",
    timestamp: Date.now()
  });
  
  // Get business info from database
  const { docs: businessInfo } = useLiveQuery("type", { key: "business-info" });
  const shopInfo = businessInfo[0] || {
    name: "Fast Fix Tech Repair",
    tagline: "Fast & Reliable Phone & Laptop Repairs",
    address: "123 Main Street, Anytown, USA",
    phone: "(555) 123-4567",
    email: "contact@fastfixtech.com",
    hours: "Mon-Fri: 9am-7pm, Sat: 10am-5pm, Sun: Closed"
  };
  
  // Services data
  const services = [
    { id: 1, name: "Phone Repair", icon: "📱", description: "Screen replacement, battery issues, water damage" },
    { id: 2, name: "Laptop Repair", icon: "💻", description: "Hardware upgrades, screen replacement, keyboard fixes" },
    { id: 3, name: "Data Recovery", icon: "💾", description: "Recover lost data from any device" },
    { id: 4, name: "Virus Removal", icon: "🛡️", description: "Clean your device from malware and viruses" }
  ];
  
  // Success message state
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    submitRequest();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  // Initialize business info if not exists
  useEffect(() => {
    const initBusinessInfo = async () => {
      if (businessInfo.length === 0) {
        await database.put({
          type: "business-info",
          name: "Fast Fix Tech Repair",
          tagline: "Fast & Reliable Phone & Laptop Repairs",
          address: "123 Main Street, Anytown, USA",
          phone: "(555) 123-4567",
          email: "contact@fastfixtech.com",
          hours: "Mon-Fri: 9am-7pm, Sat: 10am-5pm, Sun: Closed"
        });
      }
    };
    
    initBusinessInfo();
  }, [businessInfo.length, database]);
  
  // Generate demo testimonials
  const [testimonials, setTestimonials] = useState([]);
  const generateDemoTestimonials = async () => {
    const result = await callAI("Generate 3 realistic customer testimonials for a tech repair shop. Each testimonial should include the customer name, what was repaired, and their positive experience.", {
      schema: {
        properties: {
          testimonials: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                service: { type: "string" },
                text: { type: "string" }
              }
            }
          }
        }
      }
    });
    
    const data = JSON.parse(result);
    setTestimonials(data.testimonials);
    
    // Save to database
    for (const testimonial of data.testimonials) {
      await database.put({
        type: "testimonial",
        ...testimonial,
        timestamp: Date.now()
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#242424] font-sans">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#70d6ff] to-[#ff70a6] py-16 px-4 sm:px-6 lg:px-8 rounded-b-3xl border-b-8 border-[#242424]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{shopInfo.name}</h1>
          <p className="text-xl md:text-2xl text-white mb-8">{shopInfo.tagline}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#contact" className="bg-[#ff9770] hover:bg-[#ff70a6] text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105 border-4 border-[#242424]">
              Book a Repair
            </a>
            <a href="#services" className="bg-white text-[#242424] font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105 border-4 border-[#242424]">
              Our Services
            </a>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border-4 border-[#242424]">
          <h2 className="text-3xl font-bold mb-6 text-center">Welcome to {shopInfo.name}</h2>
          <p className="text-lg mb-6">
            With over 10 years of experience, we provide fast, reliable repairs for all your devices. 
            We pride ourselves on using quality parts and offering excellent customer service to ensure 
            your satisfaction with every repair.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#ffd670] p-6 rounded-lg border-4 border-[#242424]">
              <h3 className="text-xl font-bold mb-3">⚡ Quick Turnaround</h3>
              <p>Most repairs completed same-day, so you're not left without your essential devices.</p>
            </div>
            <div className="bg-[#e9ff70] p-6 rounded-lg border-4 border-[#242424]">
              <h3 className="text-xl font-bold mb-3">🛡️ Quality Guarantee</h3>
              <p>All our repairs come with a 90-day warranty on parts and service.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-4 border-[#242424] transform hover:scale-105">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-2">{service.name}</h3>
              <p className="mb-4">{service.description}</p>
              <a href="#contact" className="text-[#ff70a6] font-medium hover:text-[#ff9770]">
                Learn more →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-[#70d6ff] py-12 px-4 sm:px-6 lg:px-8 border-y-8 border-[#242424]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">What Our Customers Say</h2>
          
          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg border-4 border-[#242424]">
                  <p className="italic mb-4">"{testimonial.text}"</p>
                  <div className="font-bold">— {testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.service}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <button 
                onClick={generateDemoTestimonials} 
                className="bg-[#ff9770] hover:bg-[#ff70a6] text-white font-bold py-3 px-8 rounded-lg text-lg border-4 border-[#242424]"
              >
                Demo Data: Load Testimonials
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Location and Hours */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-4 border-[#242424]">
            <h2 className="text-2xl font-bold mb-4">Find Us</h2>
            <p className="mb-2">{shopInfo.address}</p>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-4 border-2 border-[#242424]">
              <p className="text-gray-500">Map would be displayed here</p>
            </div>
            <p className="font-medium">Hours:</p>
            <p>{shopInfo.hours}</p>
          </div>
          
          {/* Contact Form */}
          <div id="contact" className="bg-white p-6 rounded-xl shadow-lg border-4 border-[#242424]">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            
            {showSuccess ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Thanks for reaching out! We'll get back to you shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={contactRequest.name}
                    onChange={(e) => updateRequest({ name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={contactRequest.phone}
                    onChange={(e) => updateRequest({ phone: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={contactRequest.email}
                    onChange={(e) => updateRequest({ email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={contactRequest.message}
                    onChange={(e) => updateRequest({ message: e.target.value })}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="bg-[#ff70a6] hover:bg-[#ff9770] text-white font-bold py-2 px-6 rounded-lg border-4 border-[#242424]">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Contact Info Bar */}
      <div className="bg-[#ffd670] py-6 px-4 sm:px-6 lg:px-8 border-t-8 border-[#242424]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📞</span>
            <span className="font-bold">{shopInfo.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📧</span>
            <span className="font-bold">{shopInfo.email}</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="bg-white w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#242424]">
              <span className="text-xl">📱</span>
            </a>
            <a href="#" className="bg-white w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#242424]">
              <span className="text-xl">💬</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}