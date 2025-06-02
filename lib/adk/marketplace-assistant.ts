// kfar-marketplace-app/lib/adk/marketplace-assistant.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface AgentQuery {
  query: string;
  language?: 'en' | 'he' | 'ar';
  userId?: string;
  context?: any;
}

export interface AgentResponse {
  response: string;
  suggestions?: string[];
  products?: any[];
  vendors?: any[];
  metadata?: {
    intent: string;
    confidence: number;
    language: string;
  };
}

export class MarketplaceAssistant {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  
  async processQuery(query: AgentQuery): Promise<AgentResponse> {
    try {
      const systemPrompt = `You are an intelligent assistant for KFAR Vegan Marketplace in Dimona, Israel.
You help customers find vegan products, provide vendor information, suggest recipes, and assist with orders.
You are knowledgeable about Israeli vegan culture and can communicate in Hebrew, English, and Arabic.

Current marketplace vendors:
- Teva Deli: 46 vegan meat alternatives (seitan, tofu products)
- People Store: 23 retail products (books, apparel, household items)
- Queen's Cuisine: Vegan burgers and kebabs
- Gahn Delight: Vegan ice cream and desserts
- Garden of Light: Fresh salads and prepared foods
- VOP Shop: Community merchandise and heritage items

Guidelines:
1. Be helpful and friendly
2. Recommend products based on user needs
3. Provide cultural context when relevant
4. Support multiple languages naturally
5. Suggest complementary products
6. Share simple recipes when asked

User Query: ${query.query}
Language: ${query.language || 'en'}`;
      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse intent from response
      const intent = await this.detectIntent(query.query);
      
      // Extract product/vendor mentions if any
      const products = await this.extractProductMentions(text);
      const vendors = await this.extractVendorMentions(text);
      
      return {
        response: text,
        suggestions: await this.generateSuggestions(intent, query.context),
        products,
        vendors,
        metadata: {
          intent,
          confidence: 0.9,
          language: query.language || 'en'
        }
      };
    } catch (error) {
      console.error('Agent processing error:', error);
      return {
        response: "I'm sorry, I'm having trouble processing your request. Please try again.",
        metadata: {
          intent: 'error',
          confidence: 0,
          language: query.language || 'en'
        }
      };
    }
  }
  
  private async detectIntent(query: string): Promise<string> {
    const intents = {
      product_search: /looking for|need|want|where can i find|do you have/i,
      recipe: /recipe|cook|make|prepare|ingredients/i,
      vendor_info: /vendor|store|shop|teva deli|people store|queen|gahn|garden|vop/i,
      order: /order|buy|purchase|checkout|cart/i,
      general: /.*/
    };
    
    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(query)) return intent;
    }
    return 'general';
  }  
  private async extractProductMentions(text: string): Promise<any[]> {
    // Simple extraction - in production, use NER or more sophisticated parsing
    const productKeywords = ['seitan', 'tofu', 'burger', 'ice cream', 'salad', 'book'];
    const mentioned = [];
    
    for (const keyword of productKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        mentioned.push({ keyword, confidence: 0.8 });
      }
    }
    
    return mentioned;
  }
  
  private async extractVendorMentions(text: string): Promise<any[]> {
    const vendors = [
      { id: 'teva-deli', name: 'Teva Deli' },
      { id: 'people-store', name: 'People Store' },
      { id: 'queens-cuisine', name: "Queen's Cuisine" },
      { id: 'gahn-delight', name: 'Gahn Delight' },
      { id: 'garden-of-light', name: 'Garden of Light' },
      { id: 'vop-shop', name: 'VOP Shop' }
    ];
    
    return vendors.filter(v => 
      text.toLowerCase().includes(v.name.toLowerCase())
    );
  }
  
  private async generateSuggestions(intent: string, context?: any): Promise<string[]> {
    const suggestions: Record<string, string[]> = {
      product_search: [
        "Browse all vegan products",
        "View Teva Deli's meat alternatives",
        "Check out new arrivals"
      ],
      recipe: [
        "View recipe collection",
        "Find recipes by ingredient",
        "Quick meal ideas"
      ],
      vendor_info: [
        "View all vendors",
        "See vendor locations",
        "Contact vendor"
      ],
      order: [
        "View cart",
        "Track order",
        "Checkout help"
      ],
      general: [
        "Browse marketplace",
        "Today's specials",
        "About KFAR"
      ]
    };
    
    return suggestions[intent] || suggestions.general;
  }
}