import re
from datetime import datetime
from enum import nonmember

from flask import Flask, request, jsonify

month_translations = {
    "ianuarie": "January",
    "februarie": "February",
    "martie": "March",
    "aprilie": "April",
    "mai": "May",
    "iunie": "June",
    "iulie": "July",
    "august": "August",
    "septembrie": "September",
    "octombrie": "October",
    "noiembrie": "November",
    "decembrie": "December"
}

def convert_date(date_str):
    try:
        for ro, en in month_translations.items():
            if ro in date_str.lower():
                date_str = re.sub(ro, en, date_str, flags=re.IGNORECASE)
                break

        for fmt in ("%d/%m/%Y", "%d.%m.%Y", "%d-%m-%Y", "%d/%m/%y", "%d.%m.%y", "%d-%m-%y",
                    "%d %B %Y", "%d %B, %Y", "%B %d, %Y", "%B %d %Y"):
            try:
                dt = datetime.strptime(date_str.strip(), fmt)
                return dt.strftime("%d.%m.%Y")
            except ValueError:
                continue
    except:
        pass
    return None

def convert_time(time_str):
    try:
        return datetime.strptime(time_str.strip(), "%I:%M %p").strftime("%H:%M")
    except:
        try:
            return datetime.strptime(time_str.strip(), "%H:%M").strftime("%H:%M")
        except:
            return None

def extract_date_time(inp):
    date_patterns = [
        r"(?:în\s+data\s+de|data|date|on)?\s*[:\-]?\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})",
        r"(?:on)?\s*(\d{1,2})\s+(ianuarie|februarie|martie|aprilie|mai|iunie|iulie|august|septembrie|octombrie|noiembrie|decembrie|January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{2,4})",
        r"(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{2,4})",
        r"(?:the\s*)?(\d{1,2})(?:st|nd|rd|th)?\s*(?:of\s+)?(January|February|March|April|May|June|July|August|September|October|November|December),?\s+(\d{2,4})"
    ]

    time_patterns = [
        r"(?:ora|at|time)\s*[:\-]?\s*(\d{1,2}[.:]\d{2})\s*(AM|PM|am|pm)?",
    ]

    extracted_date = None
    extracted_time = None

    # Extract date
    for pattern in date_patterns:
        match = re.search(pattern, inp, re.IGNORECASE)
        if match:
            groups = match.groups()
            if len(groups) == 1:
                extracted_date = convert_date(groups[0])
            elif len(groups) == 3:
                extracted_date = convert_date(f"{groups[0]} {groups[1]} {groups[2]}")
            break

    # Extract time
    for pattern in time_patterns:
        match = re.search(pattern, inp, re.IGNORECASE)
        if match:
            time_str = match.group(1).replace('.', ':')
            ampm = match.group(2)
            if ampm:
                extracted_time = convert_time(f"{time_str} {ampm}")
            else:
                extracted_time = convert_time(time_str)
            break

    return extracted_date, extracted_time


def extract_meeting_title(email_subject: str) -> str:
    subject = email_subject.strip()

    # 1. If "is back" or Romanian equivalent exists, cut before it
    if re.search(r'\b(is back|revine|se întoarce)\b', subject, flags=re.IGNORECASE):
        return re.split(r'\b(is back|revine|se întoarce)\b', subject, flags=re.IGNORECASE)[0].strip()

    # 1.5 If title is in quotes, extract it
    match = re.search(r'["“”„](.+?)["“”]', subject)
    if match:
        return match.group(1).strip()

    # 2. Handle Romanian: "Invitație: Title - date/time"
    match = re.search(r'invita[țt]ie.*?[:\-]\s*([^-]+?)\s*-\s', subject, re.IGNORECASE)
    if match:
        subject = match.group(1).strip()

    # 3. Handle Romanian: "Invitație la evenimentul" or "Invitație eveniment"
    elif re.search(r'invita[țt]ie\s+(la\s+)?eveniment(ul)?[:\-]?\s*(.+?)\s*-\s', subject, re.IGNORECASE):
        subject = re.search(r'invita[țt]ie\s+(la\s+)?eveniment(ul)?[:\-]?\s*(.+?)\s*-\s', subject, re.IGNORECASE).group(3).strip()

    # 4. Handle Romanian: "Invitație | Title", "Invitație - Title", or "Invitație: Title"
    elif re.search(r'invita[țt]ie\s*[\|\-:]\s*(.+)', subject, re.IGNORECASE):
        subject = re.search(r'invita[țt]ie\s*[\|\-:]\s*(.+)', subject, re.IGNORECASE).group(1).strip()

    # 4.1 Handle English: "Invitation | Title", "You're invited to - Title", etc.
    elif re.search(r'(invitation|you\'?re invited)\s*(to\s+)?[\|\-:]\s*(.+)', subject, re.IGNORECASE):
        subject = re.search(r'(invitation|you\'?re invited)\s*(to\s+)?[\|\-:]\s*(.+)', subject, re.IGNORECASE).group(3).strip()

    # 4.2 Handle English: "You're invited to Event Name"
    elif re.search(r'you\'?re invited to\s+(.+)', subject, re.IGNORECASE):
        subject = re.search(r'you\'?re invited to\s+(.+)', subject, re.IGNORECASE).group(1).strip()

    # 4.3 Handle English: "Invitation to Event Name"
    elif re.search(r'invitation to\s+(.+)', subject, re.IGNORECASE):
        subject = re.search(r'invitation to\s+(.+)', subject, re.IGNORECASE).group(1).strip()

    # 4.5 Handle Romanian: "Invitație Title" (no punctuation, fallback case)
    elif re.search(r'\binvita[țt]ie\s+\w+', subject, re.IGNORECASE):
        match = re.search(r'\binvita[țt]ie\s+([^\s\-:,]+)', subject, re.IGNORECASE)
        if match:
            subject = "Invitație " + match.group(1).strip()

    # 5. Handle "Invitație", "Event", "Eveniment", or "Oportunitate|Opportunity - Title"
    elif re.search(r'\b(invita[țt]ie|event|eveniment|oportunitate|opportunity)\b[^-]*-\s*(.+)', subject, re.IGNORECASE):
        subject = re.search(r'\b(invita[țt]ie|event|eveniment|oportunitate|opportunity)\b[^-]*-\s*(.+)', subject, re.IGNORECASE).group(2).strip()

    # 6. Handle English: "Event at Something - Title"
    elif re.search(r'event\s+at\s+.*-\s*(.+)', subject, re.IGNORECASE):
        subject = re.search(r'event\s+at\s+.*-\s*(.+)', subject, re.IGNORECASE).group(1).strip()

    # 6.1 Handle Romanian: "Eveniment la Something - Title"
    elif re.search(r'eveniment(ul)?\s+la\s+.*-\s*(.+)', subject, re.IGNORECASE):
        subject = re.search(r'eveniment(ul)?\s+la\s+.*-\s*(.+)', subject, re.IGNORECASE).group(2).strip()

    # 7. Handle "Event at Something" with no dash
    elif re.search(r'event\s+at\s+(.+)', subject, re.IGNORECASE):
        subject = re.search(r'event\s+at\s+(.+)', subject, re.IGNORECASE).group(1).strip()

    # 8. Cut off "- date/time" formats
    subject = re.split(
        r'\s*-\s*(?=\d{1,2}\s+\w+|\d{1,2}[:.]\d{2}|ora\s*\d+|\d{1,2}[\./]\d{1,2}|\d{4})',
        subject
    )[0].strip()

    # 9. Cut off ", date" or ", number" endings
    subject = re.split(
        r'\s*,\s*(?=\d{1,2}(\s+\w+)?|\d{4}|ora\s*\d+)',
        subject
    )[0].strip()

    # 🔁 NEW: Remove trailing stuff like ", ..." or " - ..." if not handled above
    subject = re.split(r'[\-,]\s+', subject)[0].strip()

    # 10. Remove trailing digits if likely noise
    subject = re.sub(r'[\s,]*(\d{1,2})$', '', subject).strip()

    return subject


def extract_meeting_location(text):
    # Detect link (if any)
    link_match = re.search(r"(https?://\S+)", text)
    link = link_match.group(1) if link_match else None

    # Detect hybrid
    hybrid_match = re.search(r"(Hybrid\s*\(.*?\))", text, re.IGNORECASE)
    if hybrid_match:
        locatie = hybrid_match.group(1).strip()
        return f"{locatie}, Link: {link}" if link else locatie

    # Detect online
    if re.search(r"\b(?:online)\b", text, re.IGNORECASE):
        return f"Online, Link: {link}" if link else "Online"

    # Patterns for Romanian + English locations
    patterns = [
        # Romanian
        r"📍\s*(?:Loca[țt]ie[:\-]?\s*)?(.+)",
        r"\bla\s+([A-Z][\w\s\-&,\.]+)",
        r"\bîn\s+([A-Z][\w\s\-&,\.]+)",
        r"\bse\s+(?:va\s+)?desf[aă]șura\s+(?:la|în)\s+([A-Z][\w\s\-&,\.]+)",
        r"\b(?:va|are)\s+avea\s+loc\s+(?:la|în)?\s*([A-Z][\w\s\-&,\.]+)",

        # English
        r"\bwill\s+take\s+place\s+(?:at|in)\s+([A-Z][\w\s\-&,\.]+)",
        r"\btakes\s+place\s+(?:at|in)\s+([A-Z][\w\s\-&,\.]+)",
        r"\bis\s+held\s+(?:at|in)\s+([A-Z][\w\s\-&,\.]+)",
        r"\bwill\s+be\s+held\s+(?:at|in)\s+([A-Z][\w\s\-&,\.]+)",
        r"\bwill\s+be\s+hosted\s+(?:at|in)\s+([A-Z][\w\s\-&,\.]+)",
        r"\bwill\s+happen\s+(?:at|in)\s+([A-Z][\w\s\-&,\.]+)",
        r"📍\s*(?:Location[:\-]?\s*)?([A-Z][\w\s\-&,\.]+)"
    ]

    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            locatie = match.group(1).strip()
            locatie = re.sub(r"[\.!\n,;]+$", "", locatie)
            return locatie

    return "Locație necunoscută"




app = Flask(__name__)

@app.route('/process-information', methods=['POST'])
def process_information():
    data = request.get_json()
    print("Received data from Power automate:\n")

    email_subject = data.get("email_subject")
    email_from = data.get("email_from")
    email_cc = data.get("email_cc")
    email_bcc = data.get("email_bcc")
    email_date = data.get("email_date")
    email_id = data.get("Message_ID")
    email_body = data.get("message_body")


    print(f"Subject: {email_subject}")
    print(f"From: {email_from}")
    print(f"CC: {email_cc}")
    print(f"BCC: {email_bcc}")
    print(f"Email date: {email_date}")
    print(f"Email ID: {email_id}")
    print(f"Body: {email_body}\n")


    extracted_meeting_date, extracted_meeting_time = extract_date_time(email_body)
    extracted_meeting_title = extract_meeting_title(email_subject)
    extracted_meeting_location = extract_meeting_location(email_body)

    print(f"⏰ Extracted meeting title: {extracted_meeting_title}")
    print(f"⏰ Extracted meeting location: {extracted_meeting_location}")
    print(f"📅 Extracted meeting date: {extracted_meeting_date}")
    print(f"⏰ Extracted meeting time: {extracted_meeting_time}")


    return jsonify({"status": "received"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


