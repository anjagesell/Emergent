# E-Mail Konfiguration für OCTA Verfügbarkeitsanfragen

## Übersicht
Alle Verfügbarkeitsanfragen werden automatisch an **Alltagshilfe007@web.de** gesendet.

Die Anfragen werden zusätzlich in der MongoDB-Datenbank gespeichert als Backup.

## SMTP-Einstellungen konfigurieren

### 1. Öffnen Sie die Datei `/app/backend/.env`

### 2. Füllen Sie die folgenden Felder aus:

#### Für Web.de E-Mail:
```env
SMTP_SERVER="smtp.web.de"
SMTP_PORT="587"
SMTP_USERNAME="ihre-email@web.de"
SMTP_PASSWORD="ihr-passwort"
SMTP_FROM_EMAIL="ihre-email@web.de"
RECIPIENT_EMAIL="Alltagshilfe007@web.de"
```

#### Für Gmail:
```env
SMTP_SERVER="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USERNAME="ihre-email@gmail.com"
SMTP_PASSWORD="ihr-app-passwort"
SMTP_FROM_EMAIL="ihre-email@gmail.com"
RECIPIENT_EMAIL="Alltagshilfe007@web.de"
```

**Hinweis für Gmail:** Sie benötigen ein "App-Passwort":
1. Gehen Sie zu https://myaccount.google.com/security
2. Aktivieren Sie 2-Faktor-Authentifizierung
3. Erstellen Sie ein App-Passwort unter "App-Passwörter"
4. Verwenden Sie dieses App-Passwort anstelle Ihres normalen Passworts

#### Für andere E-Mail-Anbieter (1&1, GMX, etc.):
Konsultieren Sie die SMTP-Einstellungen Ihres E-Mail-Anbieters.

Typische SMTP-Server:
- **1&1/IONOS**: smtp.ionos.de (Port 587)
- **GMX**: mail.gmx.net (Port 587)
- **Outlook/Hotmail**: smtp-mail.outlook.com (Port 587)

### 3. Backend neu starten

Nach dem Ändern der `.env`-Datei:

```bash
sudo supervisorctl restart backend
```

## Test der E-Mail-Funktion

1. Öffnen Sie die Webseite
2. Klicken Sie auf "Verfügbarkeit anfragen"
3. Füllen Sie das Formular aus
4. Senden Sie die Anfrage ab
5. Prüfen Sie den Posteingang von **Alltagshilfe007@web.de**

## E-Mail-Format

Die E-Mail enthält:
- Vollständiger Name des Anfragenden
- E-Mail-Adresse
- Telefonnummer
- Gewählte Dienstleistungsbereiche
- Nachricht/Anfrage-Text
- Datum und Uhrzeit
- Eindeutige Anfrage-ID

## Troubleshooting

### Problem: Keine E-Mails werden empfangen

**Lösung 1:** Prüfen Sie die Logs
```bash
tail -f /var/log/supervisor/backend.err.log
```

**Lösung 2:** Überprüfen Sie die SMTP-Einstellungen
- Sind alle Felder in `.env` korrekt ausgefüllt?
- Ist das Passwort korrekt?
- Ist der SMTP-Port korrekt?

**Lösung 3:** Firewall/Sicherheit
- Manche E-Mail-Anbieter blockieren SMTP von bestimmten IPs
- Prüfen Sie, ob SMTP-Zugriff von externen Servern erlaubt ist

### Problem: "SMTP not configured" Warnung

Dies bedeutet, dass die SMTP-Felder in `.env` noch leer sind.
Die Anfrage wird trotzdem in der Datenbank gespeichert.

## Anfragen aus der Datenbank abrufen

Falls E-Mail-Versand nicht funktioniert, können Sie die Anfragen direkt aus der Datenbank abrufen:

```bash
# MongoDB Shell öffnen
mongosh mongodb://localhost:27017/test_database

# Anfragen anzeigen
db.availability_requests.find().pretty()
```

Oder über die API:
```
GET https://ihre-domain.preview.emergentagent.com/api/availability-requests
```

## Sicherheitshinweise

⚠️ **Wichtig:**
- Teilen Sie niemals Ihre `.env`-Datei oder SMTP-Zugangsdaten
- Verwenden Sie starke, einzigartige Passwörter
- Bei Gmail: Verwenden Sie App-Passwörter, nicht Ihr Haupt-Passwort
- Ändern Sie regelmäßig Ihre Passwörter

## Support

Bei Problemen mit der E-Mail-Konfiguration kontaktieren Sie Ihren E-Mail-Anbieter für die korrekten SMTP-Einstellungen.
