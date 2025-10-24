// Local Chat API - TypeScript Version
// يعمل بدون API خارجي

interface ChatResponse {
  reply: string;
  videoLinks: string[];
  timestamp: string;
  studentId: string;
  subject: string;
  messageId: string;
}

class LocalChatAPI {
  private responses: { [key: string]: { reply: string; videoLinks: string[] } };

  constructor() {
    this.responses = {
      // التحيات
      'مرحبا': {
        reply: `مرحباً! أنا المساعد الذكي لأكاديمية الشرق. أنا هنا لمساعدتك في دراستك. يمكنني:\n\n• شرح الدروس بطريقة مبسطة\n• تلخيص المواد في نقاط واضحة\n• اقتراح فيديوهات تعليمية\n• الإجابة على الأسئلة الأكاديمية\n• تقديم نصائح دراسية\n\nما الذي تريد المساعدة فيه؟`,
        videoLinks: []
      },
      
      // طلبات الشرح
      'شرح': {
        reply: `أهلاً! سأقوم بشرح الموضوع لك بطريقة مبسطة ومفهومة.\n\nيرجى تحديد الموضوع الذي تريد شرحه، وسأقوم بشرحه لك خطوة بخطوة مع أمثلة توضيحية.`,
        videoLinks: [
          'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          'https://www.youtube.com/watch?v=example1'
        ]
      },
      
      // طلبات التلخيص
      'تلخيص': {
        reply: `سأقوم بتلخيص الموضوع لك في نقاط واضحة ومفهومة.\n\nيرجى تحديد الموضوع الذي تريد تلخيصه، وسأقدم لك:\n• النقاط الرئيسية\n• المفاهيم المهمة\n• الأمثلة التوضيحية\n• النصائح للفهم`,
        videoLinks: []
      },
      
      // طلبات المساعدة
      'مساعدة': {
        reply: `أنا هنا لمساعدتك في دراستك! يمكنني مساعدتك في:\n\n📚 **شرح الدروس**: شرح أي درس بطريقة مبسطة\n📝 **تلخيص المواد**: تلخيص الدروس في نقاط واضحة\n🎥 **الفيديوهات**: اقتراح فيديوهات تعليمية مفيدة\n❓ **الأسئلة**: الإجابة على أسئلتك الأكاديمية\n💡 **النصائح**: تقديم نصائح دراسية مخصصة\n\nما الذي تحتاج مساعدة فيه تحديداً؟`,
        videoLinks: []
      },
      
      // الشكر
      'شكرا': {
        reply: `العفو! أنا سعيد جداً لمساعدتك. 😊\n\nإذا كان لديك أي أسئلة أخرى أو تحتاج مساعدة في أي موضوع، فلا تتردد في سؤالي. أنا هنا دائماً لمساعدتك في دراستك!\n\nأتمنى لك التوفيق والنجاح! 🎓✨`,
        videoLinks: []
      },
      
      // الرياضيات
      'رياضيات': {
        reply: `أهلاً! سأساعدك في الرياضيات. يمكنني شرح:\n\n🔢 **الجبر**: المعادلات والمتغيرات\n📐 **الهندسة**: الأشكال والزوايا\n📊 **الإحصاء**: البيانات والرسوم البيانية\n📈 **التفاضل والتكامل**: للمراحل المتقدمة\n\nما هو الموضوع الذي تريد شرحه في الرياضيات؟`,
        videoLinks: [
          'https://www.youtube.com/watch?v=math1',
          'https://www.youtube.com/watch?v=math2'
        ]
      },
      
      // العلوم
      'علوم': {
        reply: `أهلاً! سأساعدك في العلوم. يمكنني شرح:\n\n⚗️ **الكيمياء**: العناصر والتفاعلات\n🔬 **الفيزياء**: القوى والطاقة\n🧬 **الأحياء**: الكائنات الحية\n🌍 **علوم الأرض**: البيئة والطبيعة\n\nما هو الموضوع الذي تريد شرحه في العلوم؟`,
        videoLinks: [
          'https://www.youtube.com/watch?v=science1',
          'https://www.youtube.com/watch?v=science2'
        ]
      },
      
      // اللغة العربية
      'عربي': {
        reply: `أهلاً! سأساعدك في اللغة العربية. يمكنني شرح:\n\n📖 **النحو**: قواعد اللغة العربية\n✍️ **الصرف**: تحليل الكلمات\n📚 **الأدب**: الشعر والنثر\n🗣️ **البلاغة**: فنون الكلام\n\nما هو الموضوع الذي تريد شرحه في اللغة العربية؟`,
        videoLinks: [
          'https://www.youtube.com/watch?v=arabic1'
        ]
      },
      
      // اللغة الإنجليزية
      'انجليزي': {
        reply: `Hello! I can help you with English. I can explain:\n\n📝 **Grammar**: Rules and structures\n📚 **Vocabulary**: Words and meanings\n🗣️ **Conversation**: Speaking skills\n✍️ **Writing**: Composition and essays\n\nWhat topic would you like help with in English?`,
        videoLinks: [
          'https://www.youtube.com/watch?v=english1'
        ]
      },
      
      // أسئلة كيف
      'كيف': {
        reply: `سأساعدك في فهم كيفية حل هذه المشكلة.\n\nيرجى توضيح السؤال أكثر حتى أتمكن من مساعدتك بشكل أفضل. يمكنك أن تسأل:\n• كيف أحل هذه المسألة؟\n• كيف أفهم هذا المفهوم؟\n• كيف أدرس بفعالية؟`,
        videoLinks: []
      },
      
      // أسئلة متى
      'متى': {
        reply: `سأساعدك في معرفة التوقيت المناسب.\n\nهل تقصد:\n• متى موعد الامتحان؟\n• متى أفضل وقت للمراجعة؟\n• متى يجب أن أبدأ الدراسة؟`,
        videoLinks: []
      },
      
      // أسئلة أين
      'أين': {
        reply: `سأساعدك في العثور على المعلومة.\n\nهل تقصد:\n• أين أجد هذه المعلومة في الكتاب؟\n• أين أجد مصادر إضافية؟\n• أين أجد فيديوهات تعليمية؟`,
        videoLinks: []
      },
      
      // أسئلة لماذا
      'لماذا': {
        reply: `سأساعدك في فهم السبب.\n\nهذا سؤال ممتاز! يرجى توضيح السؤال أكثر حتى أتمكن من شرح السبب بشكل واضح ومفهوم.`,
        videoLinks: []
      },
      
      // الرد الافتراضي
      'default': {
        reply: `شكراً لسؤالك! أنا المساعد الذكي لأكاديمية الشرق.\n\nيمكنني مساعدتك في:\n\n📚 **شرح الدروس**: أي درس تريده\n📝 **تلخيص المواد**: في نقاط واضحة\n🎥 **الفيديوهات**: اقتراح فيديوهات تعليمية\n❓ **الأسئلة**: الإجابة على أسئلتك\n💡 **النصائح**: نصائح دراسية مفيدة\n\nما الذي تريد المساعدة فيه تحديداً؟`,
        videoLinks: [
          'https://www.youtube.com/watch?v=example2',
          'https://www.youtube.com/watch?v=example3'
        ]
      }
    };
  }

  // تحليل الرسالة وإرجاع الرد المناسب
  analyzeMessage(message: string, subject: string = 'عام'): { reply: string; videoLinks: string[] } {
    const lowerMessage = message.toLowerCase();
    
    // البحث عن الكلمات المفتاحية
    if (lowerMessage.includes('مرحبا') || lowerMessage.includes('hello') || lowerMessage.includes('أهلا') || lowerMessage.includes('السلام')) {
      return this.responses['مرحبا'];
    }
    else if (lowerMessage.includes('شكرا') || lowerMessage.includes('شكراً') || lowerMessage.includes('thanks')) {
      return this.responses['شكرا'];
    }
    else if (lowerMessage.includes('شرح') || lowerMessage.includes('explain') || lowerMessage.includes('وضح')) {
      return this.responses['شرح'];
    }
    else if (lowerMessage.includes('تلخيص') || lowerMessage.includes('summary') || lowerMessage.includes('ملخص')) {
      return this.responses['تلخيص'];
    }
    else if (lowerMessage.includes('مساعدة') || lowerMessage.includes('help') || lowerMessage.includes('ساعد')) {
      return this.responses['مساعدة'];
    }
    else if (lowerMessage.includes('كيف') || lowerMessage.includes('how')) {
      return this.responses['كيف'];
    }
    else if (lowerMessage.includes('متى') || lowerMessage.includes('when')) {
      return this.responses['متى'];
    }
    else if (lowerMessage.includes('أين') || lowerMessage.includes('where')) {
      return this.responses['أين'];
    }
    else if (lowerMessage.includes('لماذا') || lowerMessage.includes('why')) {
      return this.responses['لماذا'];
    }
    else if (lowerMessage.includes('رياضيات') || lowerMessage.includes('math') || lowerMessage.includes('حساب')) {
      return this.responses['رياضيات'];
    }
    else if (lowerMessage.includes('علوم') || lowerMessage.includes('science') || lowerMessage.includes('فيزياء') || lowerMessage.includes('كيمياء')) {
      return this.responses['علوم'];
    }
    else if (lowerMessage.includes('عربي') || lowerMessage.includes('arabic') || lowerMessage.includes('نحو') || lowerMessage.includes('أدب')) {
      return this.responses['عربي'];
    }
    else if (lowerMessage.includes('انجليزي') || lowerMessage.includes('english') || lowerMessage.includes('إنجليزي')) {
      return this.responses['انجليزي'];
    }
    else {
      return this.responses['default'];
    }
  }

  // إضافة تأخير محاكي للواقع
  async simulateDelay(): Promise<void> {
    const delay = 1000 + Math.random() * 2000; // 1-3 ثواني
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // معالجة الرسالة الرئيسية
  async processMessage(message: string, studentId: string, subject: string = 'عام'): Promise<ChatResponse> {
    try {
      // محاكاة تأخير API
      await this.simulateDelay();
      
      // تحليل الرسالة
      const response = this.analyzeMessage(message, subject);
      
      // إضافة معلومات إضافية
      return {
        ...response,
        timestamp: new Date().toISOString(),
        studentId,
        subject,
        messageId: Date.now().toString()
      };
      
    } catch (error) {
      console.error('Local Chat API Error:', error);
      return {
        reply: 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.',
        videoLinks: [],
        timestamp: new Date().toISOString(),
        studentId,
        subject,
        messageId: Date.now().toString()
      };
    }
  }
}

// إنشاء instance واحد للاستخدام
const localChatAPI = new LocalChatAPI();

// تصدير الدوال
export { localChatAPI };
export default localChatAPI;
