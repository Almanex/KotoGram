export default {
    translation: {
        appName: 'Skazochki',
        header: {
            home: 'Startseite',
            create: 'Geschichte erstellen',
            myStories: 'Meine Geschichten'
        },
        home: {
            welcome: 'Willkommen bei Skazochki!',
            subtitle: 'Erstellen Sie einzigartige Geschichten für Ihre Kinder',
            createButton: 'Geschichte erstellen',
            features: {
                title: 'App-Funktionen',
                personalization: {
                    title: 'Personalisierung',
                    description: 'Erstellen Sie Geschichten basierend auf den Interessen Ihres Kindes'
                },
                audio: {
                    title: 'Audio-Format',
                    description: 'Hören oder lesen Sie Geschichten mit Ihrem Kind'
                },
                collaboration: {
                    title: 'Zusammenarbeit',
                    description: 'Erstellen Sie Geschichten gemeinsam mit Kindern'
                }
            }
        },
        createStory: {
            title: 'Geschichte erstellen',
            form: {
                childName: 'Name des Kindes',
                gender: {
                    label: 'Geschlecht',
                    male: 'Junge',
                    female: 'Mädchen'
                },
                age: 'Alter',
                interests: {
                    label: 'Interessen',
                    placeholder: 'Zum Beispiel: Weltraum, Dinosaurier, Prinzessinnen'
                },
                storyType: {
                    label: 'Geschichte Typ',
                    space: 'Weltraum-Abenteuer',
                    magic: 'Märchen',
                    animals: 'Tiergeschichten',
                    time: 'Zeitreisen'
                }
            },
            buttons: {
                generate: 'Geschichte generieren',
                generating: 'Generiere...',
                save: 'Speichern',
                saving: 'Speichere...',
                play: 'Abspielen',
                stop: 'Stopp',
                new: 'Neue Geschichte'
            },
            saveSuccess: 'Geschichte erfolgreich gespeichert!'
        },
        myStories: {
            title: 'Meine Geschichten',
            noStories: 'Sie haben noch keine gespeicherten Geschichten',
            deleteButton: 'Löschen',
            confirmDelete: 'Möchten Sie diese Geschichte wirklich löschen?',
            defaultTitle: 'Geschichte für {name}'
        },
        footer: {
            rights: '© 2024 Skazochki. Alle Rechte vorbehalten.',
            privacy: 'Datenschutz',
            terms: 'Nutzungsbedingungen',
            contacts: 'Kontakt'
        },
        errors: {
            generation: 'Bei der Generierung der Geschichte ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
            saving: 'Beim Speichern der Geschichte ist ein Fehler aufgetreten.',
            loading: 'Fehler beim Laden der Geschichten.',
            deleting: 'Fehler beim Löschen der Geschichte.',
            playback: 'Fehler bei der Wiedergabe der Geschichte.',
            unsupportedBrowser: 'Ihr Browser unterstützt die Vorlesefunktion nicht.',
            noStoryToSave: 'Keine Geschichte zum Speichern. Bitte generieren Sie zuerst eine Geschichte.',
            requiredFields: 'Bitte füllen Sie alle erforderlichen Felder aus',
            audioGeneration: 'Bei der Erstellung der Audiodatei ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
        },
        buttons: {
            generating: 'Audio wird erstellt...',
            generateAudio: 'Audio erstellen',
            downloadAudio: 'Audio herunterladen'
        }
    }
}; 