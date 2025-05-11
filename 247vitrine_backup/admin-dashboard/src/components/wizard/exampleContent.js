/**
 * Beispielinhalte für verschiedene Handwerksbranchen
 */

const exampleContent = {
  // Sanitär, Heizung, Klima
  plumber: {
    general: {
      title: 'Meister-Sanitär Schmidt - Ihr Experte für Sanitär, Heizung und Klima',
      description: 'Professionelle Sanitär-, Heizungs- und Klimatechnik aus einer Hand. Qualität, Zuverlässigkeit und Termintreue seit über 20 Jahren.',
      logo: ''
    },
    hero: {
      title: 'Ihr Spezialist für Sanitär, Heizung und Klima',
      subtitle: 'Kompetente Beratung, fachgerechte Installation und zuverlässiger Service',
      image: ''
    },
    about: {
      title: 'Über uns',
      text: 'Seit über 20 Jahren sind wir Ihr zuverlässiger Partner für alle Sanitär-, Heizungs- und Klimaarbeiten in Berlin und Umgebung. Unser erfahrenes Team aus Meistern und Gesellen sorgt für fachgerechte Installation und Wartung Ihrer Anlagen. Wir legen großen Wert auf Qualität, Zuverlässigkeit und Termintreue.',
      image: ''
    },
    services: [
      {
        title: 'Sanitärinstallation',
        description: 'Komplette Badsanierung, Installation von Sanitäranlagen, Reparatur von Wasserleitungen und Abflüssen.',
        icon: '🚿'
      },
      {
        title: 'Heizungstechnik',
        description: 'Installation und Wartung von Heizungsanlagen, Brennwerttechnik, Wärmepumpen und Solarthermie.',
        icon: '🔥'
      },
      {
        title: 'Klimatechnik',
        description: 'Einbau und Service von Klimaanlagen, Lüftungssystemen und Wärmerückgewinnung.',
        icon: '❄️'
      }
    ],
    contact: {
      email: 'info@meister-sanitaer-schmidt.de',
      phone: '+49 30 123456789',
      street: 'Musterstraße',
      houseNumber: '123',
      postalCode: '12345',
      city: 'Berlin',
      address: 'Musterstraße 123, 12345 Berlin'
    },
    socialMedia: {
      facebook: 'https://facebook.com/meister-sanitaer-schmidt',
      instagram: 'https://instagram.com/meister_sanitaer_schmidt',
      whatsapp: '+49 30 123456789'
    },
    openingHours: [
      { day: 'Montag', open: '08:00', close: '17:00', closed: false },
      { day: 'Dienstag', open: '08:00', close: '17:00', closed: false },
      { day: 'Mittwoch', open: '08:00', close: '17:00', closed: false },
      { day: 'Donnerstag', open: '08:00', close: '17:00', closed: false },
      { day: 'Freitag', open: '08:00', close: '16:00', closed: false },
      { day: 'Samstag', open: '09:00', close: '13:00', closed: false },
      { day: 'Sonntag', open: '09:00', close: '17:00', closed: true }
    ],
    faqs: [
      {
        question: 'Wie lange dauert die Ausführung eines Sanitärauftrags?',
        answer: 'Die Dauer hängt vom Umfang des Auftrags ab. Kleinere Reparaturen können innerhalb weniger Stunden erledigt sein, während umfangreichere Installationen oder Badsanierungen mehrere Tage bis Wochen in Anspruch nehmen können. Wir erstellen Ihnen gerne einen detaillierten Zeitplan für Ihr spezifisches Projekt.',
        order: 0
      },
      {
        question: 'Bieten Sie einen Notdienst an?',
        answer: 'Ja, wir bieten einen 24-Stunden-Notdienst für dringende Sanitärprobleme wie Rohrbrüche oder verstopfte Abflüsse an. Für Notfälle erreichen Sie uns unter unserer Notfallnummer.',
        order: 1
      },
      {
        question: 'Welche Garantie geben Sie auf Ihre Arbeiten?',
        answer: 'Wir gewähren auf alle unsere Installationsarbeiten eine Garantie von 2 Jahren. Auf die verbauten Materialien gilt die Herstellergarantie, die je nach Produkt variieren kann.',
        order: 2
      },
      {
        question: 'Erstellen Sie kostenlose Angebote?',
        answer: 'Ja, wir erstellen Ihnen gerne ein unverbindliches und kostenloses Angebot für Ihr Projekt. Kontaktieren Sie uns einfach per Telefon oder über unser Kontaktformular.',
        order: 3
      }
    ],
    servicesCatalog: {
      title: 'Unsere Dienstleistungen',
      description: 'Wir bieten Ihnen ein umfassendes Angebot an Sanitärdienstleistungen für Ihr Zuhause oder Gewerbe.',
      categories: [
        {
          name: 'Sanitärinstallationen',
          description: 'Professionelle Installation und Wartung von Sanitäranlagen aller Art.',
          services: [
            {
              name: 'Badsanierung',
              description: 'Komplette Renovierung Ihres Badezimmers',
              details: 'Wir übernehmen die komplette Sanierung Ihres Badezimmers - von der Planung bis zur Ausführung. Dazu gehören Demontage der alten Einrichtung, Installation neuer Sanitärobjekte, Fliesenarbeiten, Elektroinstallation und Malerarbeiten.',
              icon: '🛁',
              imageUrl: ''
            },
            {
              name: 'Wasserinstallation',
              description: 'Verlegung und Reparatur von Wasserleitungen',
              details: 'Fachgerechte Installation und Reparatur von Wasserleitungen in Kupfer, Edelstahl oder Kunststoff. Wir sorgen für eine zuverlässige und langlebige Wasserversorgung in Ihrem Gebäude.',
              icon: '🚿',
              imageUrl: ''
            },
            {
              name: 'Abwasserinstallation',
              description: 'Fachgerechte Verlegung von Abwasserleitungen',
              details: 'Installation und Reparatur von Abwasserleitungen nach den aktuellen technischen Standards. Wir sorgen für eine einwandfreie Ableitung des Abwassers und vermeiden so Feuchtigkeitsschäden und unangenehme Gerüche.',
              icon: '🔧',
              imageUrl: ''
            }
          ]
        },
        {
          name: 'Heizungstechnik',
          description: 'Effiziente Heizungslösungen für Ihr Zuhause.',
          services: [
            {
              name: 'Heizungsinstallation',
              description: 'Einbau moderner Heizsysteme',
              details: 'Wir installieren moderne und energieeffiziente Heizsysteme wie Gas-, Öl- oder Pelletheizungen sowie Wärmepumpen. Dabei achten wir auf eine optimale Auslegung und Einstellung für maximale Effizienz.',
              icon: '🔥',
              imageUrl: ''
            },
            {
              name: 'Heizungswartung',
              description: 'Regelmäßige Wartung Ihrer Heizungsanlage',
              details: 'Regelmäßige Wartung verlängert die Lebensdauer Ihrer Heizung und spart Energiekosten. Wir überprüfen alle wichtigen Komponenten, reinigen das System und optimieren die Einstellungen.',
              icon: '⚙️',
              imageUrl: ''
            },
            {
              name: 'Fußbodenheizung',
              description: 'Installation von Fußbodenheizungen',
              details: 'Wir installieren komfortable Fußbodenheizungen, die für eine angenehme Wärmeverteilung sorgen. Sowohl Warmwasser- als auch elektrische Systeme sind möglich, je nach Ihren Anforderungen.',
              icon: '♨️',
              imageUrl: ''
            }
          ]
        },
        {
          name: 'Notdienst & Reparaturen',
          description: 'Schnelle Hilfe bei Sanitärnotfällen.',
          services: [
            {
              name: '24h Notdienst',
              description: 'Schnelle Hilfe bei Wasserschäden und Rohrbrüchen',
              details: 'Unser Notdienst ist rund um die Uhr für Sie erreichbar. Bei Wasserschäden, Rohrbrüchen oder verstopften Abflüssen sind wir schnell vor Ort und beheben das Problem zuverlässig.',
              icon: '🚨',
              imageUrl: ''
            },
            {
              name: 'Rohrreinigung',
              description: 'Beseitigung von Verstopfungen',
              details: 'Mit modernen Geräten beseitigen wir zuverlässig Verstopfungen in Abflüssen, Toiletten und Rohrleitungen. Wir arbeiten sauber und effizient, um Ihre Abwasserleitungen wieder frei zu bekommen.',
              icon: '🧹',
              imageUrl: ''
            },
            {
              name: 'Leckageortung',
              description: 'Präzise Ortung von Wasserlecks',
              details: 'Mit modernster Technik wie Thermografie und Akustiksensoren können wir Wasserlecks präzise orten, ohne größere Beschädigungen zu verursachen. So können wir gezielt reparieren und Folgeschäden vermeiden.',
              icon: '🔍',
              imageUrl: ''
            }
          ]
        }
      ]
    },
    blog: {
      title: 'Aktuelles & Neuigkeiten',
      description: 'Hier finden Sie aktuelle Informationen und Neuigkeiten aus unserem Unternehmen und der Sanitärbranche.',
      posts: [
        {
          title: 'Neue Wasserspartechniken für Ihr Badezimmer',
          content: `Wasser ist eine kostbare Ressource, die es zu schützen gilt. In diesem Beitrag stellen wir Ihnen die neuesten Wasserspartechniken für Ihr Badezimmer vor.

Moderne Armaturen mit Durchflussbegrenzern können den Wasserverbrauch um bis zu 50% reduzieren, ohne den Komfort zu beeinträchtigen. Besonders beliebt sind derzeit Thermostat-Armaturen, die nicht nur Wasser, sondern auch Energie sparen, da die gewünschte Temperatur schneller erreicht wird.

Auch bei Toilettenspülungen gibt es erhebliche Fortschritte: Spülkästen mit Stopp-Funktion oder Zwei-Mengen-Spülung reduzieren den Wasserverbrauch deutlich. Die neueste Generation von Toiletten kommt sogar mit nur 3,5 Litern pro Spülgang aus – im Vergleich zu älteren Modellen mit 9 Litern eine enorme Einsparung.

Duschköpfe mit Luftbeimischung erzeugen einen vollen, angenehmen Wasserstrahl, obwohl tatsächlich weniger Wasser verbraucht wird. Einige Modelle verfügen sogar über eine Taste, mit der der Wasserfluss kurzzeitig unterbrochen werden kann – ideal zum Einseifen.

Wenn Sie mehr über wassersparende Techniken erfahren möchten oder eine Beratung wünschen, kontaktieren Sie uns gerne. Wir helfen Ihnen dabei, Ihr Badezimmer umweltfreundlicher zu gestalten und gleichzeitig Ihre Wasser- und Energiekosten zu senken.`,
          summary: 'Erfahren Sie, wie moderne Sanitärtechnik Ihnen helfen kann, Wasser zu sparen und die Umwelt zu schonen.',
          imageUrl: '',
          author: 'Thomas Müller',
          publishDate: '2023-05-15T10:00:00.000Z',
          tags: ['Wassersparen', 'Badezimmer', 'Umweltschutz'],
          slug: 'neue-wasserspartechniken-fuer-ihr-badezimmer'
        },
        {
          title: 'Unser Team wächst: Zwei neue Gesellen verstärken unseren Betrieb',
          content: `Wir freuen uns, zwei neue Gesellen in unserem Team begrüßen zu dürfen. Max Mustermann und Lisa Schmidt haben ihre Ausbildung zum Anlagenmechaniker für Sanitär-, Heizungs- und Klimatechnik erfolgreich abgeschlossen und verstärken ab sofort unser Team.

Max hat seine Ausbildung mit Auszeichnung abgeschlossen und bringt besondere Kenntnisse im Bereich der Heizungstechnik mit. Lisa hat sich während ihrer Ausbildung auf Sanitärinstallationen spezialisiert und wird unser Team bei Badsanierungen unterstützen.

Mit dieser Verstärkung können wir noch besser auf die Wünsche unserer Kunden eingehen und Aufträge schneller bearbeiten. Besonders in der aktuell hohen Auftragslage ist dies eine wichtige Verstärkung für unser Unternehmen.

Wir wünschen Max und Lisa einen guten Start und freuen uns auf die Zusammenarbeit!`,
          summary: 'Unser Team wächst weiter: Wir begrüßen zwei neue Gesellen in unserem Betrieb.',
          imageUrl: '',
          author: 'Michael Schmidt',
          publishDate: '2023-08-01T14:30:00.000Z',
          tags: ['Team', 'Mitarbeiter', 'Unternehmen'],
          slug: 'unser-team-waechst-zwei-neue-gesellen'
        },
        {
          title: 'Förderungen für Heizungsmodernisierung 2023: Was Sie wissen sollten',
          content: `Die Bundesregierung hat die Förderprogramme für energetische Sanierungen und insbesondere für Heizungsmodernisierungen für 2023 aktualisiert. Wir geben Ihnen einen Überblick über die wichtigsten Änderungen und Möglichkeiten.

Die Bundesförderung für effiziente Gebäude (BEG) wurde überarbeitet und bietet nun attraktive Zuschüsse für den Einbau klimafreundlicher Heizungen. Besonders gefördert werden Wärmepumpen, Solarthermieanlagen und Biomasseheizungen.

Für den Einbau einer Wärmepumpe können Sie einen Grundzuschuss von 25% der Investitionskosten erhalten. Wenn Sie eine alte Öl-, Kohle- oder Nachtspeicherheizung ersetzen, erhöht sich der Zuschuss um weitere 10 Prozentpunkte auf insgesamt 35%.

Auch für Solarthermieanlagen gibt es attraktive Förderungen: Bis zu 25% der Investitionskosten werden übernommen, wenn die Anlage zur Heizungsunterstützung oder Warmwasserbereitung eingesetzt wird.

Wichtig zu wissen: Die Förderung muss vor Beginn der Maßnahme beantragt werden. Wir unterstützen Sie gerne bei der Antragstellung und beraten Sie zu den für Ihr Gebäude optimalen Lösungen.

Kontaktieren Sie uns für eine individuelle Beratung zu Fördermöglichkeiten und technischen Lösungen für Ihre Heizungsmodernisierung.`,
          summary: 'Informieren Sie sich über die aktuellen Förderprogramme für Heizungsmodernisierungen im Jahr 2023.',
          imageUrl: '',
          author: 'Thomas Müller',
          publishDate: '2023-02-10T09:15:00.000Z',
          tags: ['Förderung', 'Heizung', 'Energiesparen'],
          slug: 'foerderungen-heizungsmodernisierung-2023'
        }
      ]
    }
  },

  // Elektrotechnik
  electrician: {
    general: {
      title: 'Elektro Müller - Ihr Elektriker für alle Fälle',
      description: 'Kompetente Elektroinstallationen, Reparaturen und Beratung für Privat- und Gewerbekunden. 24h Notdienst verfügbar.',
      logo: ''
    },
    hero: {
      title: 'Elektro Müller - Ihr Fachbetrieb für Elektrotechnik',
      subtitle: 'Zuverlässige Elektroinstallationen und 24h Notdienst',
      image: ''
    },
    about: {
      title: 'Über unser Unternehmen',
      text: 'Elektro Müller ist ein Familienbetrieb mit über 15 Jahren Erfahrung in der Elektroinstallation. Unser Team besteht aus qualifizierten Elektrikern, die alle Arbeiten fachgerecht und nach den neuesten Sicherheitsstandards ausführen. Wir sind Ihr kompetenter Partner für alle elektrischen Anlagen in Wohn- und Geschäftsgebäuden.',
      image: ''
    },
    services: [
      {
        title: 'Elektroinstallationen',
        description: 'Neuinstallationen und Modernisierung von elektrischen Anlagen in Wohn- und Geschäftsgebäuden.',
        icon: '⚡'
      },
      {
        title: 'Smarthome-Lösungen',
        description: 'Planung und Installation von intelligenten Haussteuerungssystemen für mehr Komfort und Energieeffizienz.',
        icon: '🏠'
      },
      {
        title: '24h Notdienst',
        description: 'Schnelle Hilfe bei elektrischen Notfällen rund um die Uhr, an 365 Tagen im Jahr.',
        icon: '🔧'
      }
    ],
    contact: {
      email: 'info@elektro-mueller.de',
      phone: '+49 30 987654321',
      street: 'Elektroweg',
      houseNumber: '42',
      postalCode: '12345',
      city: 'Berlin',
      address: 'Elektroweg 42, 12345 Berlin'
    },
    socialMedia: {
      facebook: 'https://facebook.com/elektro-mueller',
      instagram: 'https://instagram.com/elektro_mueller',
      whatsapp: '+49 30 987654321'
    },
    openingHours: [
      { day: 'Montag', open: '07:30', close: '18:00', closed: false },
      { day: 'Dienstag', open: '07:30', close: '18:00', closed: false },
      { day: 'Mittwoch', open: '07:30', close: '18:00', closed: false },
      { day: 'Donnerstag', open: '07:30', close: '18:00', closed: false },
      { day: 'Freitag', open: '07:30', close: '16:00', closed: false },
      { day: 'Samstag', open: '08:00', close: '12:00', closed: false },
      { day: 'Sonntag', open: '09:00', close: '17:00', closed: true }
    ],
    faqs: [
      {
        question: 'Welche Elektroarbeiten darf ich selbst durchführen?',
        answer: 'Als Laie dürfen Sie nur sehr einfache Elektroarbeiten selbst durchführen, wie z.B. das Wechseln von Glühbirnen oder Steckern. Alle Arbeiten an der Elektroinstallation müssen aus Sicherheitsgründen von einem Fachbetrieb durchgeführt werden. Wir beraten Sie gerne, welche Arbeiten in Ihrem Fall notwendig sind.',
        order: 0
      },
      {
        question: 'Wie oft sollte ich meine Elektroinstallation überprüfen lassen?',
        answer: 'Wir empfehlen, die Elektroinstallation in Wohngebäuden alle 4-5 Jahre überprüfen zu lassen. Bei gewerblich genutzten Gebäuden sind kürzere Intervalle vorgeschrieben. Eine regelmäßige Überprüfung erhöht die Sicherheit und kann teure Schäden verhindern.',
        order: 1
      },
      {
        question: 'Bieten Sie auch Beratung zu Energieeinsparungen an?',
        answer: 'Ja, wir bieten umfassende Beratung zur Energieeffizienz an. Dazu gehören Empfehlungen zur Beleuchtung, zu Haushaltsgeräten und zur intelligenten Steuerung Ihrer Elektroinstallation. Sprechen Sie uns an, wir erstellen Ihnen gerne ein individuelles Konzept.',
        order: 2
      },
      {
        question: 'Installieren Sie auch Wallboxen für Elektroautos?',
        answer: 'Ja, wir sind spezialisiert auf die Installation von Wallboxen für Elektrofahrzeuge. Wir beraten Sie zur passenden Lösung, prüfen Ihre Hausinstallation auf Eignung und führen die fachgerechte Installation durch. Auch die Beantragung von Fördermitteln unterstützen wir gerne.',
        order: 3
      }
    ],
    servicesCatalog: {
      title: 'Elektrodienstleistungen',
      description: 'Professionelle Elektrodienstleistungen für Privat- und Gewerbekunden.',
      categories: [
        {
          name: 'Elektroinstallationen',
          description: 'Fachgerechte Elektroinstallationen für Neu- und Altbauten.',
          services: [
            {
              name: 'Neuinstallationen',
              description: 'Komplette Elektroinstallation für Neubauten',
              details: 'Wir planen und installieren die gesamte Elektrik in Ihrem Neubau nach den neuesten Standards. Von der Unterverteilung über Steckdosen und Schalter bis hin zu Beleuchtungssystemen - alles aus einer Hand.',
              icon: '⚡',
              imageUrl: ''
            },
            {
              name: 'Altbausanierung',
              description: 'Modernisierung veralteter Elektroinstallationen',
              details: 'Wir bringen Ihre veraltete Elektroinstallation auf den neuesten Stand der Technik. Dabei achten wir besonders auf Sicherheitsaspekte und die Integration moderner Technologien in bestehende Strukturen.',
              icon: '🔌',
              imageUrl: ''
            },
            {
              name: 'Sicherungskästen',
              description: 'Installation und Modernisierung von Sicherungskästen',
              details: 'Moderne Sicherungskästen bieten mehr Sicherheit und Flexibilität. Wir tauschen Ihren alten Sicherungskasten aus oder erweitern ihn nach Ihren Bedürfnissen mit FI-Schutzschaltern und Überspannungsschutz.',
              icon: '🔧',
              imageUrl: ''
            }
          ]
        },
        {
          name: 'Smart Home',
          description: 'Intelligente Haussteuerung für mehr Komfort und Effizienz.',
          services: [
            {
              name: 'Smart Home Installation',
              description: 'Einrichtung intelligenter Haussteuerungssysteme',
              details: 'Wir installieren und konfigurieren Smart Home Systeme wie KNX, Homematic oder WLAN-basierte Lösungen. Steuern Sie Beleuchtung, Heizung, Jalousien und mehr bequem per App oder Sprachbefehl.',
              icon: '🏠',
              imageUrl: ''
            },
            {
              name: 'Beleuchtungssteuerung',
              description: 'Intelligente Lichtsteuerung für Ihr Zuhause',
              details: 'Mit intelligenten Beleuchtungssystemen schaffen Sie die richtige Atmosphäre für jeden Anlass. Wir installieren dimm- und farbsteuerbare LED-Systeme, die Sie per App oder Sprachbefehl steuern können.',
              icon: '💡',
              imageUrl: ''
            },
            {
              name: 'Sicherheitstechnik',
              description: 'Alarmanlagen und Videoüberwachung',
              details: 'Schützen Sie Ihr Zuhause mit modernen Sicherheitssystemen. Wir installieren Alarmanlagen, Bewegungsmelder, Videoüberwachung und Zutrittskontrollsysteme, die Sie auch aus der Ferne überwachen können.',
              icon: '🔒',
              imageUrl: ''
            }
          ]
        },
        {
          name: 'E-Mobilität',
          description: 'Ladelösungen für Elektrofahrzeuge.',
          services: [
            {
              name: 'Wallbox-Installation',
              description: 'Installation von Ladestationen für E-Autos',
              details: 'Wir installieren Wallboxen aller gängigen Hersteller für das schnelle und sichere Laden Ihres Elektrofahrzeugs zu Hause. Dabei prüfen wir Ihre Hausinstallation auf Eignung und führen notwendige Anpassungen durch.',
              icon: '🚗',
              imageUrl: ''
            },
            {
              name: 'Lastmanagement',
              description: 'Intelligente Steuerung des Ladestroms',
              details: 'Mit einem intelligenten Lastmanagementsystem verhindern wir Überlastungen Ihres Hausanschlusses. So können mehrere E-Fahrzeuge gleichzeitig geladen werden, ohne dass die Sicherung auslöst.',
              icon: '⚙️',
              imageUrl: ''
            },
            {
              name: 'Förderberatung',
              description: 'Beratung zu Fördermöglichkeiten für E-Mobilität',
              details: 'Wir beraten Sie zu aktuellen Förderprogrammen für Wallboxen und unterstützen Sie bei der Antragstellung. So können Sie von staatlichen Zuschüssen profitieren und Kosten sparen.',
              icon: '📋',
              imageUrl: ''
            }
          ]
        }
      ]
    },
    blog: {
      title: 'Elektro-News',
      description: 'Aktuelle Informationen und Neuigkeiten aus der Elektrobranche und unserem Unternehmen.',
      posts: [
        {
          title: 'Smart Home: Die Zukunft des Wohnens ist jetzt',
          content: `Smart Home Technologien revolutionieren die Art und Weise, wie wir leben und mit unserem Zuhause interagieren. In diesem Beitrag geben wir einen Überblick über die aktuellen Möglichkeiten und Trends.

Die Grundlage eines Smart Homes bildet ein zuverlässiges Netzwerk. Moderne WLAN-Systeme mit Mesh-Technologie sorgen für eine stabile Verbindung in allen Räumen. Alternativ bieten kabelgebundene Systeme wie KNX maximale Zuverlässigkeit und Flexibilität, erfordern jedoch eine umfangreichere Installation.

Besonders beliebt sind derzeit Sprachassistenten wie Amazon Alexa, Google Assistant oder Apple HomeKit, die als zentrale Steuerungseinheit dienen können. Über sie lassen sich Beleuchtung, Heizung, Jalousien und viele weitere Geräte bequem per Sprachbefehl steuern.

Im Bereich der Beleuchtung bieten intelligente LED-Systeme nicht nur Energieeffizienz, sondern auch die Möglichkeit, Lichtfarbe und Helligkeit anzupassen oder automatisierte Beleuchtungsszenarien zu erstellen. Besonders praktisch: Die Beleuchtung kann bei Abwesenheit simuliert werden, um potenzielle Einbrecher abzuschrecken.

Auch die Heizungssteuerung wird immer intelligenter: Smarte Thermostate lernen Ihre Gewohnheiten und passen die Temperatur automatisch an. Sie erkennen, wenn niemand zu Hause ist, und senken die Temperatur, um Energie zu sparen.

Wenn Sie mehr über die Möglichkeiten eines Smart Homes erfahren möchten, kontaktieren Sie uns gerne für eine individuelle Beratung. Wir helfen Ihnen, die für Sie passende Lösung zu finden und umzusetzen.`,
          summary: 'Erfahren Sie, wie Smart Home Technologien Ihr Leben komfortabler, sicherer und energieeffizienter machen können.',
          imageUrl: '',
          author: 'Markus Weber',
          publishDate: '2023-06-20T11:30:00.000Z',
          tags: ['Smart Home', 'Technologie', 'Digitalisierung'],
          slug: 'smart-home-die-zukunft-des-wohnens-ist-jetzt'
        },
        {
          title: 'E-Mobilität: So machen Sie Ihr Zuhause fit für Ihr Elektroauto',
          content: `Die Elektromobilität ist auf dem Vormarsch. Immer mehr Menschen entscheiden sich für ein Elektroauto. Doch wie bereitet man sein Zuhause optimal auf das Laden eines E-Autos vor?

Die einfachste Lösung ist eine Wallbox, die an der Wand der Garage oder des Carports montiert wird. Im Vergleich zum Laden an einer herkömmlichen Steckdose bietet eine Wallbox mehrere Vorteile: Sie lädt deutlich schneller, ist sicherer und kann in ein Smart Home System integriert werden.

Vor der Installation einer Wallbox sollte die Elektroinstallation des Hauses überprüft werden. Wichtig ist, dass der Hausanschluss und die Zuleitung ausreichend dimensioniert sind. Bei älteren Gebäuden kann eine Modernisierung des Hausanschlusses notwendig sein.

Für Mehrfamilienhäuser oder Unternehmen mit mehreren Ladepunkten empfehlen wir ein intelligentes Lastmanagement. Dieses verteilt die verfügbare Leistung dynamisch auf die aktiven Ladepunkte und verhindert so eine Überlastung des Netzanschlusses.

Aktuell gibt es attraktive Förderprogramme für die Installation von Wallboxen. Wir beraten Sie gerne zu den aktuellen Fördermöglichkeiten und unterstützen Sie bei der Antragstellung.

Kontaktieren Sie uns für eine individuelle Beratung zur optimalen Ladelösung für Ihr Elektroauto.`,
          summary: 'Informieren Sie sich über die optimale Ladelösung für Ihr Elektroauto und wie Sie Ihr Zuhause dafür vorbereiten können.',
          imageUrl: '',
          author: 'Markus Weber',
          publishDate: '2023-04-05T09:45:00.000Z',
          tags: ['E-Mobilität', 'Wallbox', 'Elektroauto'],
          slug: 'e-mobilitaet-zuhause-fit-fuer-elektroauto'
        },
        {
          title: 'Sicherheit im Fokus: Moderne Alarmanlagen und Videoüberwachung',
          content: `Die Sicherheit des eigenen Zuhauses oder Unternehmens hat höchste Priorität. Moderne Sicherheitstechnik bietet heute umfassenden Schutz und Kontrolle – auch aus der Ferne.

Alarmanlagen haben sich in den letzten Jahren stark weiterentwickelt. Moderne Systeme arbeiten nicht nur mit Bewegungsmeldern, sondern auch mit Tür- und Fensterkontakten, Glasbruchmeldern und sogar Rauchmeldern. Bei einem Alarm werden Sie sofort per App benachrichtigt und können entsprechend reagieren.

Besonders praktisch ist die Integration in bestehende Smart Home Systeme. So können bei einem Alarm automatisch alle Lichter eingeschaltet oder Rollläden geöffnet werden, um potenzielle Einbrecher abzuschrecken.

Im Bereich der Videoüberwachung bieten hochauflösende IP-Kameras mit Nachtsicht und Bewegungserkennung optimalen Schutz. Die Aufnahmen werden entweder lokal gespeichert oder in einer Cloud, sodass Sie jederzeit und von überall darauf zugreifen können.

Für Unternehmen empfehlen wir zusätzlich Zutrittskontrollsysteme, die den Zugang zu bestimmten Bereichen nur autorisierten Personen ermöglichen. Diese Systeme können mit der Zeiterfassung kombiniert werden.

Wichtig zu wissen: Bei der Installation von Videoüberwachung sind die Datenschutzbestimmungen zu beachten. Wir beraten Sie gerne, was erlaubt ist und was nicht.

Kontaktieren Sie uns für eine individuelle Beratung zu Ihrem Sicherheitskonzept.`,
          summary: 'Erfahren Sie, wie moderne Sicherheitstechnik Ihr Zuhause oder Unternehmen optimal schützt.',
          imageUrl: '',
          author: 'Julia Schneider',
          publishDate: '2023-03-12T14:20:00.000Z',
          tags: ['Sicherheit', 'Alarmanlage', 'Videoüberwachung'],
          slug: 'sicherheit-im-fokus-alarmanlagen-videoueberwachung'
        }
      ]
    }
  },

  // Malerbetrieb
  painter: {
    general: {
      title: 'Malerbetrieb Farbenwelt - Für ein schöneres Zuhause',
      description: 'Professionelle Maler- und Lackierarbeiten, Fassadengestaltung und dekorative Techniken. Qualität und Sauberkeit garantiert.',
      logo: ''
    },
    hero: {
      title: 'Wir bringen Farbe in Ihr Leben',
      subtitle: 'Ihr Spezialist für Maler- und Lackierarbeiten',
      image: ''
    },
    about: {
      title: 'Über Malerbetrieb Farbenwelt',
      text: 'Malerbetrieb Farbenwelt steht seit 2005 für hochwertige Maler- und Lackierarbeiten. Unser Team aus erfahrenen Malermeistern und Gesellen sorgt für perfekte Ergebnisse bei Innen- und Außenarbeiten. Wir legen besonderen Wert auf sauberes Arbeiten, termingerechte Ausführung und den Einsatz umweltfreundlicher Materialien.',
      image: ''
    },
    services: [
      {
        title: 'Innenraumgestaltung',
        description: 'Malerarbeiten in Wohnräumen, Tapezierarbeiten, Spachtel- und Strukturtechniken.',
        icon: '🖌️'
      },
      {
        title: 'Fassadengestaltung',
        description: 'Fassadenanstriche, Wärmedämmverbundsysteme, Rissbeseitigung und Betonsanierung.',
        icon: '🏠'
      },
      {
        title: 'Dekorative Techniken',
        description: 'Lasurtechniken, Wischtechniken, Marmorierungen und andere dekorative Wandgestaltungen.',
        icon: '✨'
      }
    ],
    contact: {
      email: 'info@malerbetrieb-farbenwelt.de',
      phone: '+49 30 456789123',
      street: 'Farbstraße',
      houseNumber: '7',
      postalCode: '12345',
      city: 'Berlin',
      address: 'Farbstraße 7, 12345 Berlin'
    },
    socialMedia: {
      facebook: 'https://facebook.com/malerbetrieb-farbenwelt',
      instagram: 'https://instagram.com/malerbetrieb_farbenwelt',
      whatsapp: '+49 30 456789123'
    },
    openingHours: [
      { day: 'Montag', open: '08:00', close: '16:30', closed: false },
      { day: 'Dienstag', open: '08:00', close: '16:30', closed: false },
      { day: 'Mittwoch', open: '08:00', close: '16:30', closed: false },
      { day: 'Donnerstag', open: '08:00', close: '16:30', closed: false },
      { day: 'Freitag', open: '08:00', close: '15:00', closed: false },
      { day: 'Samstag', open: '09:00', close: '13:00', closed: false },
      { day: 'Sonntag', open: '09:00', close: '17:00', closed: true }
    ],
    faqs: [
      {
        question: 'Wie bereite ich meine Räume für Malerarbeiten vor?',
        answer: 'Für optimale Ergebnisse sollten Sie Möbel aus dem Raum entfernen oder in die Mitte stellen und mit Folie abdecken. Bilder und Dekorationen sollten abgenommen und Böden mit Abdeckmaterial geschützt werden. Wir beraten Sie gerne bei der Vorbereitung und übernehmen auf Wunsch auch diese Arbeiten für Sie.',
        order: 0
      },
      {
        question: 'Welche Farben sind für Allergiker geeignet?',
        answer: 'Für Allergiker empfehlen wir spezielle schadstoffarme und emissionsminimierte Farben, die als allergikerfreundlich zertifiziert sind. Diese Farben sind frei von Lösungsmitteln und anderen allergieauslösenden Stoffen. Wir führen verschiedene Produkte, die speziell für sensible Personen entwickelt wurden.',
        order: 1
      },
      {
        question: 'Wie lange dauert es, bis die Farbe getrocknet ist?',
        answer: 'Die Trocknungszeit hängt von der verwendeten Farbe, der Raumtemperatur und der Luftfeuchtigkeit ab. Wandfarben sind in der Regel nach 2-4 Stunden oberflächentrocken und nach 24 Stunden durchgetrocknet. Für die vollständige Aushärtung sollten Sie jedoch 7-14 Tage einplanen.',
        order: 2
      },
      {
        question: 'Können Sie auch spezielle Maltechniken anbieten?',
        answer: 'Ja, wir beherrschen verschiedene dekorative Maltechniken wie Lasuren, Wischtechniken, Spachteltechniken oder Strukturputze. Diese Techniken verleihen Ihren Wänden eine besondere Optik und Haptik. Gerne zeigen wir Ihnen Muster und beraten Sie zu den Möglichkeiten für Ihre Räume.',
        order: 3
      }
    ],
    servicesCatalog: {
      title: 'Malerarbeiten & Raumgestaltung',
      description: 'Professionelle Malerarbeiten und kreative Raumgestaltung für Ihr Zuhause.',
      categories: [
        {
          name: 'Innenraumgestaltung',
          description: 'Professionelle Malerarbeiten für Ihre Innenräume.',
          services: [
            {
              name: 'Wände & Decken',
              description: 'Malerarbeiten an Wänden und Decken',
              details: 'Wir streichen Ihre Wände und Decken in höchster Qualität. Dabei verwenden wir ausschließlich hochwertige Farben, die langlebig und pflegeleicht sind. Vor dem Streichen bereiten wir die Untergründe fachgerecht vor und beseitigen kleine Schäden.',
              icon: '🖌️',
              imageUrl: ''
            },
            {
              name: 'Tapezierarbeiten',
              description: 'Professionelles Tapezieren mit verschiedenen Materialien',
              details: 'Wir tapezieren Ihre Räume mit Papier-, Vlies- oder Textiltapeten. Auch Fototapeten oder spezielle Designtapeten bringen wir fachgerecht an. Dabei achten wir auf exakte Musteranschlüsse und saubere Kanten.',
              icon: '📜',
              imageUrl: ''
            },
            {
              name: 'Dekorative Techniken',
              description: 'Kreative Wandgestaltung mit speziellen Techniken',
              details: 'Mit dekorativen Maltechniken wie Lasuren, Wischtechniken, Spachteltechniken oder Strukturputzen verleihen wir Ihren Wänden eine besondere Optik und Haptik. Wir beraten Sie gerne zu den verschiedenen Möglichkeiten und zeigen Ihnen Muster.',
              icon: '🎨',
              imageUrl: ''
            }
          ]
        },
        {
          name: 'Fassadengestaltung',
          description: 'Professionelle Gestaltung und Schutz Ihrer Fassade.',
          services: [
            {
              name: 'Fassadenanstrich',
              description: 'Langlebiger Schutz und Verschönerung Ihrer Fassade',
              details: 'Wir streichen Ihre Fassade mit hochwertigen, witterungsbeständigen Farben. Dabei achten wir auf eine fachgerechte Vorbereitung des Untergrunds und beseitigen kleine Schäden. So schützen wir Ihr Haus vor Witterungseinflüssen und verschönern es gleichzeitig.',
              icon: '🏠',
              imageUrl: ''
            },
            {
              name: 'Wärmedämmung',
              description: 'Energetische Sanierung mit Wärmedämmverbundsystemen',
              details: 'Mit einem Wärmedämmverbundsystem (WDVS) senken Sie Ihre Heizkosten und schützen die Bausubstanz. Wir beraten Sie zu den verschiedenen Systemen und führen die Installation fachgerecht durch - von der Dämmplatte bis zum Oberputz und Anstrich.',
              icon: '❄️',
              imageUrl: ''
            },
            {
              name: 'Putzarbeiten',
              description: 'Fachgerechte Putzarbeiten an der Fassade',
              details: 'Wir führen alle Arten von Putzarbeiten an Ihrer Fassade durch - vom Grundputz über Armierungsputz bis hin zum dekorativen Oberputz. Dabei verwenden wir hochwertige Materialien, die langlebig und witterungsbeständig sind.',
              icon: '🧱',
              imageUrl: ''
            }
          ]
        },
        {
          name: 'Spezialarbeiten',
          description: 'Besondere Malerarbeiten für spezielle Anforderungen.',
          services: [
            {
              name: 'Schimmelbeseitigung',
              description: 'Nachhaltige Beseitigung von Schimmel',
              details: 'Wir beseitigen Schimmelbefall fachgerecht und nachhaltig. Dabei analysieren wir die Ursachen, entfernen den Schimmel und behandeln die betroffenen Stellen mit speziellen Anti-Schimmel-Produkten. Zudem beraten wir Sie, wie Sie zukünftigen Schimmelbefall vermeiden können.',
              icon: '🧪',
              imageUrl: ''
            },
            {
              name: 'Lackierarbeiten',
              description: 'Präzise Lackierarbeiten für Türen, Fenster und Möbel',
              details: 'Wir lackieren Ihre Türen, Fenster, Treppen oder Möbel in höchster Qualität. Dabei verwenden wir hochwertige Lacke, die langlebig und pflegeleicht sind. Vor dem Lackieren bereiten wir die Oberflächen fachgerecht vor und schleifen sie bei Bedarf.',
              icon: '🚪',
              imageUrl: ''
            },
            {
              name: 'Bodenbeläge',
              description: 'Verlegung und Renovierung von Bodenbelägen',
              details: 'Wir verlegen verschiedene Bodenbeläge wie Laminat, Vinyl oder Teppichboden. Auch die Renovierung bestehender Holzböden durch Schleifen und Versiegeln gehört zu unserem Leistungsspektrum. Wir beraten Sie gerne zu den verschiedenen Materialien und deren Eigenschaften.',
              icon: '🧹',
              imageUrl: ''
            }
          ]
        }
      ]
    },
    blog: {
      title: 'Farbe & Gestaltung',
      description: 'Aktuelle Trends, Tipps und Neuigkeiten rund um Farbe und Raumgestaltung.',
      posts: [
        {
          title: 'Farbtrends 2023: Diese Töne liegen im Trend',
          content: `Die Wahl der richtigen Farbe kann einen Raum komplett verändern. In diesem Beitrag stellen wir Ihnen die aktuellen Farbtrends für 2023 vor.

Natürliche Erdtöne dominieren weiterhin die Farbpalette. Warme Terrakotta- und Lehmtöne schaffen eine gemütliche, erdende Atmosphäre und lassen sich hervorragend mit natürlichen Materialien wie Holz, Rattan oder Leinen kombinieren.

Grüntöne erleben ein Comeback, insbesondere sanfte Salbei- und Olivtöne. Sie bringen ein Stück Natur ins Haus und wirken beruhigend und ausgleichend. Besonders schön: die Kombination mit natürlichen Holztönen oder kontrastierenden Rosétönen.

Blau in all seinen Facetten bleibt ein Klassiker. Von tiefem Marineblau bis hin zu sanftem Himmelblau – Blautöne schaffen eine ruhige, konzentrierte Atmosphäre und eignen sich besonders gut für Arbeits- und Schlafzimmer.

Für mutigere Gestaltungen liegen kräftige Akzentfarben im Trend. Ein sattes Senfgelb oder ein tiefes Bordeauxrot als Akzentwand kann einem Raum Charakter und Tiefe verleihen.

Pastelltöne werden nuancierter und bekommen einen Hauch Grau oder Beige beigemischt, was sie erwachsener und zeitloser wirken lässt. Diese "schmutzigen" Pastelltöne lassen sich vielseitig kombinieren und schaffen eine subtile, elegante Atmosphäre.

Wenn Sie Beratung zur Farbgestaltung Ihrer Räume wünschen, stehen wir Ihnen gerne zur Verfügung. Wir helfen Ihnen, die perfekte Farbkombination für Ihr Zuhause zu finden.`,
          summary: 'Entdecken Sie die aktuellen Farbtrends für 2023 und lassen Sie sich für die Gestaltung Ihrer Räume inspirieren.',
          imageUrl: '',
          author: 'Anna Müller',
          publishDate: '2023-01-15T10:00:00.000Z',
          tags: ['Farbtrends', 'Inneneinrichtung', 'Gestaltung'],
          slug: 'farbtrends-2023-diese-toene-liegen-im-trend'
        },
        {
          title: 'Nachhaltige Wandgestaltung: Ökologische Farben und Materialien',
          content: `Nachhaltigkeit spielt auch bei der Wandgestaltung eine immer größere Rolle. In diesem Beitrag informieren wir Sie über ökologische Farben und Materialien für eine gesunde Wohnumgebung.

Konventionelle Wandfarben können zahlreiche Schadstoffe enthalten, die über lange Zeit an die Raumluft abgegeben werden. Ökologische Farben hingegen basieren auf natürlichen Rohstoffen wie Kreide, Kalk, Lehm oder Kasein und sind frei von synthetischen Lösungsmitteln, Konservierungsstoffen und Weichmachern.

Besonders empfehlenswert sind Lehmfarben und -putze. Sie regulieren die Luftfeuchtigkeit, binden Schadstoffe und Gerüche und schaffen ein angenehmes Raumklima. Zudem überzeugen sie durch ihre warmen, erdigen Farbtöne und ihre samtige Oberfläche.

Kalkfarben sind eine weitere nachhaltige Alternative. Sie wirken von Natur aus antimikrobiell und schimmelhemmend und eignen sich daher besonders gut für Feuchträume. Durch ihre hohe Alkalität bieten sie keinen Nährboden für Schimmel und tragen zu einem gesunden Raumklima bei.

Auch bei Tapeten gibt es ökologische Alternativen: Papiertapeten aus FSC-zertifiziertem Papier, Grasfasertapeten oder Tapeten aus recycelten Materialien schonen Ressourcen und sind frei von Schadstoffen.

Wir beraten Sie gerne zu nachhaltigen Materialien und deren Einsatzmöglichkeiten in Ihrem Zuhause. Gemeinsam finden wir die optimale Lösung für eine gesunde und ästhetische Wandgestaltung.`,
          summary: 'Erfahren Sie mehr über ökologische Farben und Materialien für eine gesunde und nachhaltige Wandgestaltung.',
          imageUrl: '',
          author: 'Anna Müller',
          publishDate: '2023-03-22T14:30:00.000Z',
          tags: ['Nachhaltigkeit', 'Ökologisch', 'Wandgestaltung'],
          slug: 'nachhaltige-wandgestaltung-oekologische-farben'
        },
        {
          title: 'Kleine Räume optisch vergrößern: Tipps und Tricks',
          content: `Kleine Räume können schnell beengt wirken. Mit den richtigen Farben und Gestaltungstricks lassen sie sich jedoch optisch vergrößern. In diesem Beitrag teilen wir unsere besten Tipps.

Die Farbwahl spielt eine entscheidende Rolle: Helle, kühle Farbtöne wie Weiß, helles Grau oder Pastelltöne lassen Räume größer wirken. Besonders effektiv ist es, wenn Wände und Decke in der gleichen Farbe gestrichen werden, da so die Grenzen des Raumes optisch verschwimmen.

Ein häufiger Irrtum ist, dass kleine Räume komplett weiß gestrichen werden sollten. Tatsächlich kann ein gezielter Einsatz von Farbe den Raum strukturieren und interessanter gestalten. Eine farbige Akzentwand am Ende eines schmalen Raumes lässt diesen beispielsweise kürzer und dafür breiter erscheinen.

Auch Muster können die Raumwirkung beeinflussen: Horizontale Streifen lassen einen Raum breiter wirken, vertikale Streifen erhöhen ihn optisch. Große Muster sollten in kleinen Räumen sparsam eingesetzt werden, da sie den Raum optisch verkleinern können.

Spiegel sind ein bewährtes Mittel, um Räume optisch zu vergrößern. Sie reflektieren Licht und schaffen eine Illusion von Tiefe. Besonders effektiv ist ein großer Spiegel an der Wand gegenüber eines Fensters.

Die richtige Beleuchtung ist ebenfalls entscheidend: Mehrere kleinere Lichtquellen auf verschiedenen Höhen schaffen Tiefe und lassen den Raum größer wirken als eine einzelne Deckenleuchte.

Wenn Sie Beratung zur optimalen Gestaltung Ihrer kleinen Räume wünschen, stehen wir Ihnen gerne zur Verfügung. Wir helfen Ihnen, das Beste aus Ihrem Raum herauszuholen.`,
          summary: 'Lernen Sie, wie Sie mit der richtigen Farbwahl und cleveren Gestaltungstricks kleine Räume optisch vergrößern können.',
          imageUrl: '',
          author: 'Michael Wagner',
          publishDate: '2023-05-10T09:15:00.000Z',
          tags: ['Raumgestaltung', 'Kleine Räume', 'Farbgestaltung'],
          slug: 'kleine-raeume-optisch-vergroessern-tipps'
        }
      ]
    }
  }
};

export default exampleContent;
