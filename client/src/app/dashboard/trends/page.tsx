"use client";
import React, { useState, useEffect } from 'react';
import googleTrends from "google-trends-api";
import { Sparkle } from 'lucide-react';

const FashionTrendsDashboard = () => {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTrend, setSelectedTrend] = useState(null);
    const [activeTab, setActiveTab] = useState('trends');

    useEffect(() => {
        const fetchTrendingTopics = async () => {
            try {
                setLoading(true);
                if (false) {

                    googleTrends.dailyTrends(
                        {
                            geo: "IN",
                        },
                        (err, results) => {
                            if (err) {

                            } else {
                                console.log(results)
                            }
                        }
                    );

                }
                // In a real application, this would be an API call to your backend
                // For demo purposes, using the provided fashion trends data
                const fashionTrends = [
                    { title: "Sustainable Fashion", searchVolume: 4800000, category: "Fashion", growth: "+200%" },
                    { title: "Indian Luxury Brands", searchVolume: 3500000, category: "Fashion", growth: "+175%" },
                    { title: "Boho Chic Trends", searchVolume: 2800000, category: "Fashion", growth: "+150%" },
                    { title: "Gen Z Fashion Styles", searchVolume: 2500000, category: "Fashion", growth: "+120%" },
                    { title: "Nostalgic Fashion", searchVolume: 2200000, category: "Fashion", growth: "+100%" },
                    { title: "Canvas Couture", searchVolume: 1900000, category: "Fashion", growth: "+85%" },
                    { title: "Bucket Bags", searchVolume: 1600000, category: "Fashion", growth: "+70%" },
                    { title: "Athleisure Wear", searchVolume: 1300000, category: "Fashion", growth: "+60%" },
                    { title: "Traditional Indian Textiles", searchVolume: 1100000, category: "Fashion", growth: "+50%" },
                    { title: "Junior's Fashion Week", searchVolume: 900000, category: "Fashion", growth: "+40%" }
                ];

                // Simulate API delay
                setTimeout(() => {
                    setTrends(fashionTrends);
                    setLoading(false);
                }, 1000);
            } catch (err) {
                setError("Failed to fetch trending fashion topics. Please try again.");
                setLoading(false);
            }
        };

        fetchTrendingTopics();
    }, []);

    const generateSaleIdeas = (trend) => {
        const ideasMap = {
            "Sustainable Fashion": [
                "Eco-friendly collection discount of 20%",
                "Buy one, plant one tree campaign",
                "Recycled materials showcase sale"
            ],
            "Indian Luxury Brands": [
                "Designer collaboration limited-time offers",
                "Exclusive member access to luxury discount events",
                "First-purchase luxury item discount"
            ],
            "Boho Chic Trends": [
                "Bohemian summer collection flash sale",
                "Boho accessories bundle discount",
                "Free boho-inspired jewelry with purchases over ₹2000"
            ],
            "Gen Z Fashion Styles": [
                "TikTok-inspired styles discount code",
                "Student discount on trending Gen Z items",
                "Social media share & save campaign"
            ],
            "Nostalgic Fashion": [
                "Retro classics revival sale",
                "90s-inspired collection discount",
                "Vintage reproduction items bundle offers"
            ],
            "Canvas Couture": [
                "Canvas bag & accessories discount week",
                "Buy one canvas item, get 50% off second",
                "Limited edition canvas designer pieces sale"
            ],
            "Bucket Bags": [
                "Trending bucket bags showcase discount",
                "Complete the look: Bucket bag outfit bundles",
                "New arrivals bucket bag pre-sale access"
            ],
            "Athleisure Wear": [
                "Work-from-home comfort wear discount",
                "Athleisure multi-piece bundle discount",
                "Yoga & lounge wear seasonal sale"
            ],
            "Traditional Indian Textiles": [
                "Handloom heritage discount event",
                "Regional textile showcase sale",
                "Artisan-crafted pieces special pricing"
            ],
            "Junior's Fashion Week": [
                "Kids trending styles flash sale",
                "Back to school fashion discount",
                "Growing wardrobe seasonal bundle offers"
            ]
        };

        return ideasMap[trend.title] || [
            "Trending styles limited-time discount",
            "Social media campaign with influencer codes",
            "Flash sale on high-demand items"
        ];
    };

    const getCustomerAttractionInsights = (trend) => {
        const insightsMap = {
            "Sustainable Fashion": {
                customerPsychology: "Modern consumers increasingly prioritize ethical shopping and sustainability. 73% of Gen Z consumers are willing to pay more for sustainable products.",
                marketTiming: "Earth Day, World Environment Day, and Sustainable Fashion Week provide perfect campaign timing opportunities.",
                competitiveEdge: "Only 28% of fashion e-commerce platforms effectively highlight sustainability, creating a significant differentiator."
            },
            "Indian Luxury Brands": {
                customerPsychology: "Luxury shoppers seek exclusivity and heritage. 65% of premium buyers prefer local luxury brands that tell authentic cultural stories.",
                marketTiming: "Wedding season and cultural festivals drive 3x higher luxury item searches.",
                competitiveEdge: "Positioning as a curator of premium Indian designers captures the growing 'vocal for local' luxury segment."
            },
            "Boho Chic Trends": {
                customerPsychology: "Boho style appeals to free-spirited individualists seeking unique, artisanal aesthetics. Handcrafted elements create emotional connections.",
                marketTiming: "Festival season sees 4x increase in bohemian style searches.",
                competitiveEdge: "Bohemian styles have 40% higher social media shareability, driving organic customer acquisition."
            },
            "Gen Z Fashion Styles": {
                customerPsychology: "Gen Z prioritizes self-expression, sustainability and brands that take social stands. They seek authentic connections over traditional marketing.",
                marketTiming: "Back-to-college period shows 5x increase in trend-driven purchases.",
                competitiveEdge: "Gen Z represents ₹350,000 crore in spending power in India with the highest digital shopping adoption rate."
            },
            "Nostalgic Fashion": {
                customerPsychology: "Nostalgia marketing creates emotional connections. 85% of consumers report positive feelings toward retro-inspired products.",
                marketTiming: "Anniversary events of iconic fashion eras drive revival interest spikes.",
                competitiveEdge: "Vintage-inspired items have 35% higher customer loyalty and repeat purchase rates."
            },
            "Canvas Couture": {
                customerPsychology: "Canvas represents durability and understated luxury. Appeals to minimalists and sustainability-conscious consumers.",
                marketTiming: "Summer season drives 3x increase in lightweight, natural material searches.",
                competitiveEdge: "Canvas items have 45% higher margins than synthetic alternatives with strong perceived value."
            },
            "Bucket Bags": {
                customerPsychology: "Trending accessories drive fashion identity with lower purchase barriers than full outfits.",
                marketTiming: "Currently at peak of trend cycle with 2-3 month remaining opportunity window.",
                competitiveEdge: "Accessories drive 2.3x more return visits to e-commerce platforms than clothing-only purchases."
            },
            "Athleisure Wear": {
                customerPsychology: "Post-pandemic lifestyle shifts created permanent demand for comfortable yet presentable clothing.",
                marketTiming: "New Year fitness resolutions and work-from-home policies create sustained demand peaks.",
                competitiveEdge: "Athleisure has the highest cross-category bundling potential, increasing average order value by 45%."
            },
            "Traditional Indian Textiles": {
                customerPsychology: "Cultural pride and heritage preservation drives high emotional investment. Storytelling around artisans creates connection.",
                marketTiming: "Cultural festivals show 4x search volume for traditional textiles.",
                competitiveEdge: "Handloom and traditional textiles have government promotion support and growing international appeal."
            },
            "Junior's Fashion Week": {
                customerPsychology: "Parents invest more in children's fashion during milestone events and social media sharing moments.",
                marketTiming: "School year beginning and children's events drive predictable purchase cycles.",
                competitiveEdge: "Children's fashion has 28% higher margins and drives multiple seasonal purchase cycles."
            }
        };

        return insightsMap[trend.title] || {
            customerPsychology: "Trending topics create urgency and FOMO (fear of missing out), driving conversion rates up by 23%.",
            marketTiming: "Strike while interest is peaking to maximize organic traffic and reduce acquisition costs.",
            competitiveEdge: "Being first-to-market with trend-aligned promotions establishes category leadership."
        };
    };

    const calculateROI = (searchVolume) => {
        // Fashion e-commerce specific ROI calculation
        const conversionRate = 0.025; // 2.5% of trend searchers convert
        const averageOrderValue = 1800; // in INR for fashion items
        const marketingCost = searchVolume * 0.06; // 6 paise per potential customer

        const revenue = searchVolume * conversionRate * averageOrderValue;
        const profit = revenue * 0.35; // 35% profit margin for fashion
        const roi = (profit / marketingCost) * 100;

        return {
            revenue: revenue.toLocaleString('en-IN'),
            profit: profit.toLocaleString('en-IN'),
            roi: roi.toFixed(2),
            projectedSales: Math.floor(searchVolume * conversionRate)
        };
    };

    const newsItems = [
        {
            title: "Shein's Re-Entry into the Indian Market",
            date: "February 2, 2025",
            source: "REUTERS.COM",
            url: "https://reuters.com",
            summary: "After being banned in 2020 due to data security concerns, Chinese fast-fashion giant Shein has made a comeback in India through a collaboration with Reliance Retail. The new 'Shein India Fast Fashion' app offers fashionwear designed and manufactured locally.",
            impact: "This development is expected to significantly boost the fast-fashion segment, particularly among younger consumers looking for affordable trendy options."
        },
        {
            title: "Growth of India's Luxury Market",
            date: "December 16, 2024",
            source: "VOGUEBUSINESS.COM",
            url: "https://voguebusiness.com",
            summary: "The luxury fashion sector in India is experiencing rapid growth, attracting global brands like Louis Vuitton and Chanel. Factors such as a rising affluent population and the significant Indian wedding market, valued at $130 billion, contribute to this expansion.",
            impact: "Luxury brands are finding new opportunities in India, with potential for e-commerce platforms to tap into the premium segment through exclusive partnerships."
        },
        {
            title: "Can India triple its fashion sector while halving emissions?",
            date: "March 6, 2025",
            source: "VOGUEBUSINESS.COM",
            url: "https://voguebusiness.com",
            summary: "India's fashion industry aims to triple its value to $350 billion by 2030 while aligning with sustainability goals. Initiatives include the development of seven industrial 'mega-parks' and the adoption of renewable energy sources.",
            impact: "E-commerce platforms highlighting sustainable practices will gain competitive advantage as consumer awareness grows and regulations tighten."
        },
        {
            title: "Emergence of Local Luxury Brands",
            date: "March 5, 2025",
            source: "EN.WIKIPEDIA.ORG",
            url: "https://en.wikipedia.org",
            summary: "Brands like Boito are gaining prominence by blending traditional Indian textiles with modern luxury designs. These brands emphasize sustainability and support traditional handloom weaving techniques.",
            impact: "Presents an opportunity for e-commerce platforms to showcase emerging Indian luxury brands that blend heritage with contemporary design."
        },
        {
            title: "India's three trade deals in the offing",
            date: "March 4, 2025",
            source: "FT.COM",
            url: "https://ft.com",
            summary: "India is engaged in major trade deals with the US, European Union, and the UK, aiming to boost economic ties. These agreements could reduce tariffs, providing consumers with access to diverse foreign fashion products.",
            impact: "E-commerce platforms should prepare for increased competition but also new opportunities to source international fashion at better prices."
        },
        {
            title: "Fashion Industry's Wishlist for Budget 2025",
            date: "January 27, 2025",
            source: "INDIARETAILING.COM",
            url: "https://indiaretailing.com",
            summary: "Tax cuts and increased investment in smaller cities are among the top demands of sector representatives for the upcoming Union Budget 2025.",
            impact: "Potential for reduced taxes could improve margins, while expansion into tier 2 and 3 cities represents a major growth opportunity."
        }
    ];

    const marketInsights = [
        {
            title: "Fast-fashion and premium segments driving growth",
            source: "ECONOMIC TIMES, JAN 2025",
            insights: "India's fashion industry is set for recovery in FY26, with a notable upturn in fast fashion, ethnic wear, and luxury segments as consumer spending rebounds."
        },
        {
            title: "Fashion & apparel lead retail leasing",
            source: "FIBRE2FASHION, JAN 2025",
            insights: "Fashion and apparel retailers dominated India's retail sector leasing in H2 2024, with retail sales projected to grow 9% in 2025."
        },
        {
            title: "Shift to organized retail",
            source: "INDIAN RETAILER, JAN 2025",
            insights: "Rising disposable incomes and growing desire for status symbols have spurred a shift in consumption patterns, significantly favoring organized retail and e-commerce."
        },
        {
            title: "Executive sentiment on Indian market",
            source: "MCKINSEY-BOF SURVEY, NOV 2024",
            insights: "67% of fashion executives cited promising growth prospects in India for 2025, positioning the country as a key focus market despite global slowdowns."
        },
        {
            title: "Women's apparel market expansion",
            source: "STATISTA, DEC 2024",
            insights: "The women's apparel market is projected to reach nearly $39 billion by 2025, representing a significant growth opportunity for e-commerce platforms."
        },
        {
            title: "Top 2025 fashion trends forecast",
            source: "HEURITECH, 2024",
            insights: "Boho Chic in Suede, Yellow color trends, Hot Pants, and Aquatic-inspired fashion are among the top forecasted trends for 2025."
        }
    ];

    return (
        <div className="max-w-6xl rounded-lg">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">India Fashion Market Intelligence Dashboard</h1>
                <p className="text-lg text-gray-600 mt-2">Leverage real-time market insights to drive strategic sales campaigns (updates every 24 hours)</p>

                <div className="flex mt-6 border-b">
                    <button
                        onClick={() => setActiveTab('trends')}
                        className={`px-4 py-2 font-medium ${activeTab === 'trends' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Trending Searches (Google Searches)
                    </button>
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`px-4 py-2 font-medium ${activeTab === 'news' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Industry News
                    </button>
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`px-4 py-2 font-medium ${activeTab === 'insights' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Market Insights
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl text-gray-600">Analyzing fashion market data...</div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p>{error}</p>
                </div>
            ) : activeTab === 'trends' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="col-span-1 bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Trending Fashion Searches</h2>
                        <div className="space-y-2 max-h-screen overflow-y-auto">
                            {trends.map((trend, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-md cursor-pointer transition ${selectedTrend?.title === trend.title ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-white hover:bg-blue-50'}`}
                                    onClick={() => setSelectedTrend(trend)}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium">{trend.title}</h3>
                                        <span className="text-green-600 text-sm font-semibold">{trend.growth}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                                        <span>{trend.category}</span>
                                        <span>{(trend.searchVolume / 1000000).toFixed(1)}M searches</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1 lg:col-span-2">
                        {selectedTrend ? (
                            <div className="bg-white p-6 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedTrend.title}</h2>
                                        <div className="flex mt-1 space-x-3">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">{selectedTrend.category}</span>
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">{selectedTrend.growth} Growth</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-blue-600">{(selectedTrend.searchVolume / 1000000).toFixed(1)}M</div>
                                        <div className="text-sm text-gray-600">Monthly Search Volume</div>
                                    </div>

                                </div>


                                <div className="mt-8">
                                    <sub> <Sparkle className='inline-block w-4 h-4 text-red' /> AI Generated Results, proceed with caution</sub>
                                    <h3 className="text-lg font-semibold mb-3">Why This Will Attract Customers</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {(() => {
                                            const insights = getCustomerAttractionInsights(selectedTrend);
                                            return (
                                                <>
                                                    <div className="bg-purple-50 p-4 rounded-md border-l-4 border-purple-500">
                                                        <p className="text-sm font-semibold text-purple-800">Customer Psychology</p>
                                                        <p className="mt-1">{insights.customerPsychology}</p>
                                                    </div>
                                                    <div className="bg-amber-50 p-4 rounded-md border-l-4 border-amber-500">
                                                        <p className="text-sm font-semibold text-amber-800">Market Timing</p>
                                                        <p className="mt-1">{insights.marketTiming}</p>
                                                    </div>
                                                    <div className="bg-emerald-50 p-4 rounded-md border-l-4 border-emerald-500">
                                                        <p className="text-sm font-semibold text-emerald-800">Competitive Edge</p>
                                                        <p className="mt-1">{insights.competitiveEdge}</p>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-3">Recommended Sale Strategies</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {generateSaleIdeas(selectedTrend).map((idea, index) => (
                                            <div key={index} className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
                                                <p>{idea}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-3">Projected Campaign Impact</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        {(() => {
                                            const { revenue, profit, roi, projectedSales } = calculateROI(selectedTrend.searchVolume);
                                            return (
                                                <>
                                                    <div className="bg-gray-50 p-4 rounded-md text-center">
                                                        <p className="text-gray-600">Est. Revenue</p>
                                                        <p className="text-2xl font-bold">₹{revenue}</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-4 rounded-md text-center">
                                                        <p className="text-gray-600">Projected Profit</p>
                                                        <p className="text-2xl font-bold text-green-600">₹{profit}</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-4 rounded-md text-center">
                                                        <p className="text-gray-600">Est. Orders</p>
                                                        <p className="text-2xl font-bold text-blue-600">{projectedSales.toLocaleString('en-IN')}</p>
                                                    </div>
                                                    <div className="bg-gray-50 p-4 rounded-md text-center">
                                                        <p className="text-gray-600">Campaign ROI</p>
                                                        <p className="text-2xl font-bold text-purple-600">{roi}%</p>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-3">Implementation Plan</h3>
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-blue-600 h-2.5 rounded-full w-3/4"></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                                            <div>Product Curation (1 day)</div>
                                            <div>Campaign Setup (2 days)</div>
                                            <div>Launch</div>
                                        </div>
                                        <div className="mt-4 text-sm">
                                            <p className="font-semibold">Recommended Action:</p>
                                            <p className="mt-1">Launch a {selectedTrend.title} campaign within 3 days to capitalize on current search volume before trend peaks.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition mr-3">
                                        Approve Campaign
                                    </button>
                                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
                                        Request Modifications
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gray-50 p-8 rounded-lg">
                                <div className="text-center">
                                    <p className="text-lg text-gray-600">Select a fashion trend to see customer attraction insights and sales opportunities</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : activeTab === 'news' ? (
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">Stay informed with the latest developments shaping India's fashion industry to strategically position your e-commerce offerings.</p>
                    </div>

                    {newsItems.map((item, index) => (
                        <div key={index} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-semibold">{item.title}</h3>
                                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{item.date}</span>
                            </div>
                            <p className="text-xs text-blue-600 mt-1">
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{item.source}</a>
                            </p>
                            <p className="mt-3 text-gray-700">{item.summary}</p>
                            <div className="mt-4 bg-amber-50 p-3 rounded border-l-4 border-amber-400">
                                <p className="text-sm font-medium text-amber-800">E-commerce Impact:</p>
                                <p className="text-sm text-amber-700 mt-1">{item.impact}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">Key market insights to inform your e-commerce strategy and maximize sales opportunities in India's fashion landscape.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {marketInsights.map((insight, index) => (
                            <div key={index} className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold">{insight.title}</h3>
                                <p className="text-xs text-gray-500 mt-1">{insight.source}</p>
                                <p className="mt-3 text-gray-700">{insight.insights}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Key 2025 Projections</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-green-50 p-4 rounded-md text-center">
                                <p className="text-gray-600">Fashion & Apparel Growth</p>
                                <p className="text-2xl font-bold text-green-600">+9%</p>
                                <p className="text-xs text-gray-500 mt-2">Year-over-year projected increase</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-md text-center">
                                <p className="text-gray-600">E-commerce Fashion Share</p>
                                <p className="text-2xl font-bold text-blue-600">37%</p>
                                <p className="text-xs text-gray-500 mt-2">Of total fashion retail</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-md text-center">
                                <p className="text-gray-600">Growth Markets</p>
                                <p className="text-2xl font-bold text-purple-600">Tier 2 & 3</p>
                                <p className="text-xs text-gray-500 mt-2">Fastest expanding regions</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Strategic Recommendations</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-gray-50 rounded-md border-l-4 border-green-500">
                                <p className="font-medium">Capitalize on the Shein-Reliance partnership impact</p>
                                <p className="text-sm text-gray-600 mt-1">Position your platform for the fast-fashion consumer segment that will be energized by this development.</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md border-l-4 border-blue-500">
                                <p className="font-medium">Highlight sustainability credentials</p>
                                <p className="text-sm text-gray-600 mt-1">With India's push to triple fashion sector value while reducing emissions, emphasize eco-friendly practices.</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md border-l-4 border-purple-500">
                                <p className="font-medium">Prepare for trade agreement impacts</p>
                                <p className="text-sm text-gray-600 mt-1">Upcoming trade deals with US, EU and UK will change the competitive landscape - diversify your inventory accordingly.</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md border-l-4 border-amber-500">
                                <p className="font-medium">Invest in luxury and premium segments</p>
                                <p className="text-sm text-gray-600 mt-1">Rising affluent population and growing luxury market present opportunities for higher-margin offerings.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <footer className="mt-12 text-center text-gray-500 text-sm">
                <p>Data refreshes daily. Last updated: {new Date().toLocaleString('en-IN')}</p>
                <p>* Sources include industry reports, news publications, and trend analysis from March 2025</p>
            </footer>
        </div>
    );
};

export default FashionTrendsDashboard;