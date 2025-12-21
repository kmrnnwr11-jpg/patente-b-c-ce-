import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import '../firebase_options.dart';

/// Script per popolare Firestore con traduzioni di test
/// Esegui da main.dart temporaneamente per testare

class TranslationSeeder {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// Traduzioni di esempio per le prime 10 domande
  final List<Map<String, dynamic>> sampleTranslations = [
    {
      'id': 1,
      'it': 'Il segnale raffigurato preannuncia una curva a destra',
      'en': 'The sign shown indicates a curve to the right',
      'hi': 'दिखाया गया चिन्ह दाहिनी ओर मोड़ दर्शाता है',
      'ur': 'دکھایا گیا نشان دائیں طرف موڑ ظاہر کرتا ہے',
      'pa': 'ਦਿਖਾਇਆ ਗਿਆ ਚਿੰਨ੍ਹ ਸੱਜੇ ਪਾਸੇ ਮੋੜ ਦਰਸਾਉਂਦਾ ਹੈ',
    },
    {
      'id': 2,
      'it':
          'Il segnale raffigurato preannuncia un tratto di strada con pavimentazione scivolosa',
      'en': 'The sign shown warns of a stretch of road with slippery surface',
      'hi': 'दिखाया गया चिन्ह फिसलन भरी सड़क की चेतावनी देता है',
      'ur': 'دکھایا گیا نشان پھسلن والی سڑک کی وارننگ دیتا ہے',
      'pa': 'ਦਿਖਾਇਆ ਗਿਆ ਚਿੰਨ੍ਹ ਤਿਲਕਣ ਵਾਲੀ ਸੜਕ ਦੀ ਚੇਤਾਵਨੀ ਦਿੰਦਾ ਹੈ',
    },
    {
      'id': 3,
      'it': 'Il segnale raffigurato è un segnale di pericolo',
      'en': 'The sign shown is a danger sign',
      'hi': 'दिखाया गया चिन्ह एक खतरे का संकेत है',
      'ur': 'دکھایا گیا نشان ایک خطرے کی علامت ہے',
      'pa': 'ਦਿਖਾਇਆ ਗਿਆ ਚਿੰਨ੍ਹ ਖ਼ਤਰੇ ਦਾ ਸੰਕੇਤ ਹੈ',
    },
    {
      'id': 4,
      'it':
          'Il limite massimo di velocità per un autoveicolo fino a 3,5 t è di 130 km/h in autostrada',
      'en':
          'The maximum speed limit for a vehicle up to 3.5t is 130 km/h on the motorway',
      'hi':
          '3.5 टन तक के वाहन के लिए मोटरवे पर अधिकतम गति सीमा 130 किमी/घंटा है',
      'ur':
          '3.5 ٹن تک گاڑی کے لیے موٹر وے پر زیادہ سے زیادہ رفتار کی حد 130 کلومیٹر فی گھنٹہ ہے',
      'pa':
          '3.5 ਟਨ ਤੱਕ ਦੀ ਗੱਡੀ ਲਈ ਮੋਟਰਵੇ \'ਤੇ ਵੱਧ ਤੋਂ ਵੱਧ ਸਪੀਡ ਸੀਮਾ 130 ਕਿਲੋਮੀਟਰ/ਘੰਟਾ ਹੈ',
    },
    {
      'id': 5,
      'it':
          'La distanza di sicurezza deve essere aumentata se si viaggia con pneumatici usurati',
      'en':
          'The safety distance must be increased when traveling with worn tires',
      'hi': 'घिसे हुए टायरों के साथ यात्रा करते समय सुरक्षा दूरी बढ़ानी चाहिए',
      'ur': 'گھسے ہوئے ٹائروں کے ساتھ سفر کرتے وقت حفاظتی فاصلہ بڑھانا چاہیے',
      'pa': 'ਘਿਸੇ ਹੋਏ ਟਾਇਰਾਂ ਨਾਲ ਯਾਤਰਾ ਕਰਦੇ ਸਮੇਂ ਸੁਰੱਖਿਆ ਦੂਰੀ ਵਧਾਉਣੀ ਚਾਹੀਦੀ ਹੈ',
    },
    {
      'id': 6,
      'it': 'Il conducente deve sempre avere con sé la patente di guida',
      'en': 'The driver must always carry the driving license',
      'hi': 'ड्राइवर को हमेशा अपने पास ड्राइविंग लाइसेंस रखना चाहिए',
      'ur': 'ڈرائیور کو ہمیشہ اپنے پاس ڈرائیونگ لائسنس رکھنا چاہیے',
      'pa': 'ਡਰਾਈਵਰ ਨੂੰ ਹਮੇਸ਼ਾ ਆਪਣੇ ਨਾਲ ਡਰਾਈਵਿੰਗ ਲਾਇਸੈਂਸ ਰੱਖਣਾ ਚਾਹੀਦਾ ਹੈ',
    },
    {
      'id': 7,
      'it':
          'In caso di incidente, bisogna avvertire gli agenti della polizia stradale',
      'en': 'In case of accident, you must notify the traffic police',
      'hi': 'दुर्घटना होने पर ट्रैफिक पुलिस को सूचित करना चाहिए',
      'ur': 'حادثے کی صورت میں ٹریفک پولیس کو مطلع کرنا چاہیے',
      'pa': 'ਹਾਦਸੇ ਦੀ ਸੂਰਤ ਵਿੱਚ ਟ੍ਰੈਫਿਕ ਪੁਲਿਸ ਨੂੰ ਸੂਚਿਤ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ',
    },
    {
      'id': 8,
      'it': 'La sosta è vietata in corrispondenza dei passaggi a livello',
      'en': 'Parking is prohibited at level crossings',
      'hi': 'रेलवे क्रॉसिंग पर पार्किंग वर्जित है',
      'ur': 'ریلوے کراسنگ پر پارکنگ ممنوع ہے',
      'pa': 'ਰੇਲਵੇ ਕ੍ਰਾਸਿੰਗ \'ਤੇ ਪਾਰਕਿੰਗ ਵਰਜਿਤ ਹੈ',
    },
    {
      'id': 9,
      'it': 'Il semaforo verde permette di proseguire la marcia',
      'en': 'The green traffic light allows you to continue',
      'hi': 'हरी बत्ती आपको आगे बढ़ने की अनुमति देती है',
      'ur': 'سبز ٹریفک لائٹ آپ کو آگے بڑھنے کی اجازت دیتی ہے',
      'pa': 'ਹਰੀ ਬੱਤੀ ਤੁਹਾਨੂੰ ਅੱਗੇ ਵਧਣ ਦੀ ਇਜਾਜ਼ਤ ਦਿੰਦੀ ਹੈ',
    },
    {
      'id': 10,
      'it':
          'La patente di categoria B permette di guidare autoveicoli fino a 3500 kg',
      'en': 'Category B license allows driving vehicles up to 3500 kg',
      'hi': 'श्रेणी B लाइसेंस 3500 किलो तक के वाहन चलाने की अनुमति देता है',
      'ur': 'کیٹیگری B لائسنس 3500 کلو تک گاڑیاں چلانے کی اجازت دیتا ہے',
      'pa':
          'ਸ਼੍ਰੇਣੀ B ਲਾਇਸੈਂਸ 3500 ਕਿਲੋ ਤੱਕ ਦੀਆਂ ਗੱਡੀਆਂ ਚਲਾਉਣ ਦੀ ਇਜਾਜ਼ਤ ਦਿੰਦਾ ਹੈ',
    },
  ];

  /// Carica le traduzioni di test su Firestore
  Future<void> seedTranslations() async {
    print('🔄 Caricando traduzioni di test su Firestore...');

    int count = 0;
    for (final translation in sampleTranslations) {
      final id = translation['id'].toString();

      await _firestore.collection('translations').doc(id).set({
        'it': translation['it'],
        'en': translation['en'],
        'hi': translation['hi'],
        'ur': translation['ur'],
        'pa': translation['pa'],
        'createdAt': FieldValue.serverTimestamp(),
      });

      count++;
      print('✅ Caricata traduzione $id');
    }

    print('🎉 Caricate $count traduzioni di test!');
  }
}

/// Funzione da chiamare per caricare le traduzioni
Future<void> seedFirestoreTranslations() async {
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  final seeder = TranslationSeeder();
  await seeder.seedTranslations();
}
