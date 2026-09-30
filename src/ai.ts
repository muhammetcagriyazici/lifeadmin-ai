import { Lang } from '@/i18n';

export interface AIAnalysis {
  rights: string[];
  rightsEn: string[];
  recommendation: string;
  recommendationEn: string;
  nextSteps: string[];
  nextStepsEn: string[];
  response: string;
  responseEn: string;
}

interface KnowledgeEntry {
  keywords: string[];
  keywordsEn: string[];
  analysis: AIAnalysis;
}

const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ['spor', 'salon', 'gym', 'fitness', 'iptal'],
    keywordsEn: ['gym', 'fitness', 'sport', 'cancel', 'cancellation'],
    analysis: {
      rights: [
        '4077 sayılı Tüketici Kanunu Madde 48: Cayma hakkı kapsamında 14 gün içinde üyeliğinizi sebep göstermeden feshedebilirsiniz.',
        'Mesafeli Sözleşmeler Yönetmeliği Madde 15: İlk 14 gün cayma hakkınız vardır, spor salonu buna dahildir.',
        'Haksız kesinti talep edilmesi halinde TÜBİTAK\'a veya Tüketici Hakem Heyeti\'ne başvuru hakkınız doğar.',
      ],
      rightsEn: [
        'Consumer Protection Law Art. 48: You may cancel your membership within 14 days without stating any reason.',
        'Distance Contracts Regulation Art. 15: You have a 14-day right of withdrawal, gym memberships are included.',
        'If unjust deductions are demanded, you may file a complaint with the Consumer Arbitration Board.',
      ],
      recommendation:
        'Spor salonunuz iptalinizi reddedemez. Cayma hakkınızı kullanarak yazılı olarak iptal talebini iletin ve ücret iadesi isteyin. 14 gün içinde iade yapılmazsa Tüketici Hakem Heyeti\'ne başvurun.',
      recommendationEn:
        'Your gym cannot refuse your cancellation. Exercise your right of withdrawal by sending a written cancellation request and demand a refund. If not refunded within 14 days, apply to the Consumer Arbitration Board.',
      nextSteps: [
        'Aşağıdaki taslağı kopyalayın ve spor salonunun resmi e-posta adresine gönderin.',
        'E-posta gönderim tarihtini kanıt olarak saklayın (ekran görüntüsü veya alındı teyidi).',
        '14 gün içinde iade yapılmazsa e-Devlet üzerinden Tüketici Hakem Heyeti\'ne online başvuru yapın.',
      ],
      nextStepsEn: [
        'Copy the draft below and send it to your gym\'s official email address.',
        'Keep proof of sending date (screenshot or delivery confirmation).',
        'If not refunded within 14 days, file an online complaint with the Consumer Arbitration Board via e-Government.',
      ],
      response:
        'Spor salonu iptalinizi reddedemez. Tüketici Kanunu kapsamında 14 gün cayma hakkınız var. Aşağıda sizin için hazırladığım resmi iptal dilekçesini kullanabilirsiniz.',
      responseEn:
        'Your gym cannot refuse your cancellation. Under the Consumer Protection Law, you have a 14-day right of withdrawal. You can use the formal cancellation letter I\'ve prepared for you below.',
    },
  },
  {
    keywords: ['kargo', 'hasar', 'damaged', 'package', 'paket'],
    keywordsEn: ['cargo', 'damaged', 'package', 'shipping', 'delivery'],
    analysis: {
      rights: [
        'Tüketici Kanunu Madde 11: Ayıplı mal/teslimat durumunda 30 gün içinde satıcıya başvuru hakkınız vardır.',
        'Kargo şirketi sorumluluğu: Hasar teslim anında tespit edilirse tutanak tutulmalıdır.',
        'Tüketicinin seçimlik hakları: Ücret iadesi, değiştirme veya ücretsiz onarım talep edebilirsiniz.',
      ],
      rightsEn: [
        'Consumer Protection Law Art. 11: In case of defective goods/delivery, you have 30 days to apply to the seller.',
        'Carrier responsibility: If damage is detected at delivery, a report must be filed.',
        'Consumer\'s optional rights: You may demand refund, replacement, or free repair.',
      ],
      recommendation:
        'Hasarlı kargo teslim alınca mutlaka tutanak tutturun. Satıcıya 30 gün içinde yazılı başvuru yapın. İade/değişim talep edin. Reddedilirse Hakem Heyeti\'ne gidin.',
      recommendationEn:
        'Always file a damage report when receiving damaged cargo. Apply to the seller in writing within 30 days. Demand refund/replacement. If refused, go to the Arbitration Board.',
      nextSteps: [
        'Hasar fotoğraflarını çekin ve tutanak tutturun.',
        'Aşağıdaki taslağı satıcıya e-posta ile gönderin.',
        '30 gün içinde yanıt gelmezse Tüketici Hakem Heyeti\'ne başvurun.',
      ],
      nextStepsEn: [
        'Take photos of the damage and file a report.',
        'Send the draft below to the seller via email.',
        'If no response within 30 days, apply to the Consumer Arbitration Board.',
      ],
      response:
        'Hasarlı kargo durumunda haklarınız net. Önce tutanak, sonra yazılı başvuru. Aşağıdaki taslak ile satıcıya başvurabilirsiniz.',
      responseEn:
        'Your rights are clear in case of damaged cargo. First a report, then a written application. You can apply to the seller using the draft below.',
    },
  },
  {
    keywords: ['iade', 'redd', 'return', 'refusal', 'online', 'satıcı'],
    keywordsEn: ['return', 'refund', 'refusal', 'online', 'seller', 'reject'],
    analysis: {
      rights: [
        'Mesafeli Sözleşmeler Yönetmeliği: Online alışverişlerde 14 gün cayma hakkı vardır.',
        'Satıcı iadeyi reddedemez — bu yasa dışıdır.',
        'İade kargo ücreti satıcıya aittir (ayıplı ürün durumunda).',
      ],
      rightsEn: [
        'Distance Contracts Regulation: You have 14 days right of withdrawal for online purchases.',
        'The seller cannot refuse returns — this is illegal.',
        'Return shipping costs are borne by the seller (in case of defective goods).',
      ],
      recommendation:
        'Online satıcı iadeyi reddedemez. 14 gün içinde cayma hakkınızı kullanın. Reddedilmesi halinde Hakem Heyeti\'ne başvurun — genelde lehinize sonuçlanır.',
      recommendationEn:
        'An online seller cannot refuse your return. Exercise your 14-day right of withdrawal. If refused, apply to the Arbitration Board — it usually rules in your favor.',
      nextSteps: [
        'Ürünü ve faturayı hazırlayın.',
        'Aşağıdaki taslağı satıcıya gönderin.',
        'Reddedilirse e-Devlet üzerinden Hakem Heyeti başvurusu yapın.',
      ],
      nextStepsEn: [
        'Prepare the product and invoice.',
        'Send the draft below to the seller.',
        'If refused, file an Arbitration Board application via e-Government.',
      ],
      response:
        'Online satıcı iadeyi reddedemez. 14 gün cayma hakkınız var. Aşağıdaki taslak ile başvuru yapabilirsiniz.',
      responseEn:
        'An online seller cannot refuse your return. You have a 14-day right of withdrawal. You can apply using the draft below.',
    },
  },
  {
    keywords: ['banka', 'aidat', 'bank', 'fee', 'ücret', 'komisyon'],
    keywordsEn: ['bank', 'fee', 'charge', 'commission', 'refund'],
    analysis: {
      rights: [
        'Bankacılık Düzenleme ve Denetleme Kurulu (BDDK) yönetmelikleri: Haksız kesintiler iade edilmelidir.',
        'Tüketici Kanunu Madde 5: Haksız şartlar içeren sözleşmeler geçersizdir.',
        'Son 5 yıl içinde yapılan haksız kesintiler için geriye dönük iade talep edilebilir.',
      ],
      rightsEn: [
        'Banking Regulation and Supervision Agency (BDDK) regulations: Unjust deductions must be refunded.',
        'Consumer Protection Law Art. 5: Contracts with unfair terms are invalid.',
        'Unjust deductions made in the last 5 years can be claimed retroactively.',
      ],
      recommendation:
        'Bankanızdan haksız aidat/kesinti iadesi isteyin. Önce bankanın müşteri hizmetlerine yazılı başvuru yapın. 10 gün içinde yanıt gelmezse Tüketici Hakem Heyeti\'ne başvurun.',
      recommendationEn:
        'Request a refund of unjust fees from your bank. First make a written application to customer services. If no response within 10 days, apply to the Consumer Arbitration Board.',
      nextSteps: [
        'Hesap özetinizi ve kesinti tarihlerini belirleyin.',
        'Aşağıdaki taslağı bankanın müşteri hizmetleri e-postasına gönderin.',
        '10 gün içinde yanıt gelmezse Hakem Heyeti\'ne başvurun.',
      ],
      nextStepsEn: [
        'Identify your account statement and deduction dates.',
        'Send the draft below to the bank\'s customer service email.',
        'If no response within 10 days, apply to the Arbitration Board.',
      ],
      response:
        'Banka aidatları için geriye dönük iade hakkınız var. Aşağıdaki taslak ile başvuru yapabilirsiniz.',
      responseEn:
        'You have the right to retroactively claim bank fee refunds. You can apply using the draft below.',
    },
  },
];

const defaultAnalysis: AIAnalysis = {
  rights: [
    'Tüketici Kanunu kapsamında tüm tüketiciler adil işlem hakkına sahiptir.',
    'Haksız uygulamalara karşı Tüketici Hakem Heyeti\'ne başvuru hakkınız vardır.',
    'Yazılı başvuru yapma ve kanıt saklama hakkınız vardır.',
  ],
  rightsEn: [
    'Under the Consumer Protection Law, all consumers have the right to fair procedures.',
    'You have the right to apply to the Consumer Arbitration Board against unfair practices.',
    'You have the right to make written applications and keep evidence.',
  ],
  recommendation:
    'Sorununuzu yazılı olarak ilgili kuruma iletin. Kanıt saklayın ve belirli bir süre içinde yanıt gelmezse Tüketici Hakem Heyeti\'ne başvurun.',
  recommendationEn:
    'Communicate your issue in writing to the relevant institution. Keep evidence and if no response within a specific period, apply to the Consumer Arbitration Board.',
  nextSteps: [
    'Aşağıdaki taslağı ilgili kuruma gönderin.',
    'Başvuru kanıtını saklayın.',
    '30 gün içinde yanıt gelmezse Hakem Heyeti\'ne başvurun.',
  ],
  nextStepsEn: [
    'Send the draft below to the relevant institution.',
    'Keep proof of application.',
    'If no response within 30 days, apply to the Arbitration Board.',
  ],
  response:
    'Sorununuzu analiz ettim. Tüketici haklarınızı kontrol ettim ve size bir taslak hazırladım. Aşağıdaki başvuru metnini kullanabilirsiniz.',
  responseEn:
    'I\'ve analyzed your issue. I\'ve checked your consumer rights and prepared a draft for you. You can use the application text below.',
};

export function analyzeQuery(query: string): AIAnalysis {
  const lower = query.toLowerCase();
  for (const entry of knowledgeBase) {
    const allKeywords = [...entry.keywords, ...entry.keywordsEn];
    const matched = allKeywords.some((kw) => lower.includes(kw));
    if (matched) return entry.analysis;
  }
  return defaultAnalysis;
}

export function generateDraft(
  tab: 'email' | 'whatsapp' | 'formal',
  query: string,
  lang: Lang
): { content: string; subject?: string; recipient?: string } {
  if (lang === 'tr') {
    if (tab === 'email') {
      return {
        subject: 'Üyelik İptali ve Ücret İadesi Talebi',
        recipient: 'sayin@ilgilikurum.com',
        content: `Sayın İlgili,

${query} konulu sorunum hakkında başvuruda bulunmak istiyorum.

4077 sayılı Tüketici Kanunu ve ilgili yönetmelikler kapsamında, tüketicinin cayma hakkını kullanma yetkisi saklıdır. Bu bağlamda, sözleşmemin feshini ve ödediğim ücretin 14 gün içinde iadesini talep ediyorum.

Aksi halde, Tüketici Hakem Heyeti'ne başvurmak zorunda kalacağım.

Gereğini rica ederim.

Saygılarımla,
[Adınız Soyadınız]
[Telefon]
[E-posta]`,
      };
    }
    if (tab === 'whatsapp') {
      return {
        content: `Merhaba, ${query} konusunda iletişime geçiyorum.

Tüketici Kanunu kapsamında cayma hakkımı kullanarak iptal ve ücret iadesi talep ediyorum. 14 gün içinde iade yapılmazsa Tüketici Hakem Heyeti'ne başvuracağım.

İlgilenmenizi rica ederim.`,
      };
    }
      return {
        content: `DİLEKÇE

Sayın Tüketici Hakem Heyeti Başkanlığına,

Şikayetçi:
[Adınız Soyadınız]
[Adresiniz]
[Telefon]
[E-posta]

Şikayet Edilen:
[Kurum/Şirket Adı]
[Adres]

KONU: ${query} hakkında şikayet başvurusudur.

Açıklamalar:
Yukarıda belirtilen kurum ile aramda tüketicilik ilişkisi doğan bir işlem gerçekleşmiştir. Ancak, söz konusu kurum Tüketici Kanunu kapsamındaki haklarımı ihlal ederek talebimi reddetmiştir.

Bu nedenle, Tüketici Kanunu ve ilgili mevzuat gereği hakkın iadesini ve gerekli işlemlerin yapılmasını talep ediyorum.

Sonuç:
Gereğini arz ederim.

[Adınız Soyadınız]
İmza
Tarih: ${new Date().toLocaleDateString('tr-TR')}`,
      };
  }
  // English
  if (tab === 'email') {
    return {
      subject: 'Membership Cancellation and Refund Request',
      recipient: 'info@relevantcompany.com',
      content: `To Whom It May Concern,

I am writing regarding the following issue: ${query}

Under the Consumer Protection Law and applicable regulations, I reserve the right to exercise my right of withdrawal. Accordingly, I request the termination of my contract and a refund of the fees paid within 14 days.

Failure to comply will result in a complaint to the Consumer Arbitration Board.

I trust you will process this accordingly.

Sincerely,
[Your Full Name]
[Phone]
[Email]`,
    };
  }
  if (tab === 'whatsapp') {
    return {
      content: `Hello, I am contacting you regarding: ${query}

Under the Consumer Protection Law, I am exercising my right of withdrawal and requesting cancellation and a refund. If not refunded within 14 days, I will file a complaint with the Consumer Arbitration Board.

Thank you for your attention.`,
    };
  }
    return {
      content: `FORMAL PETITION

To the Consumer Arbitration Board,

Complainant:
[Your Full Name]
[Your Address]
[Phone]
[Email]

Respondent:
[Company Name]
[Address]

SUBJECT: Complaint regarding ${query}

Statement of Facts:
A consumer transaction has occurred between myself and the above-mentioned company. However, said company has violated my rights under the Consumer Protection Law by refusing my request.

Therefore, pursuant to the Consumer Protection Law and relevant regulations, I request restitution of my rights and appropriate action.

Conclusion:
I respectfully submit this petition.

[Your Full Name]
Signature
Date: ${new Date().toLocaleDateString('en-US')}`,
    };
}
