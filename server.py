import re
from datetime import datetime
import requests

session = requests.Session()

login_url = "http://localhost/Backend/Auth/login.php"
login_data = {
    "username": "alexia",
    "password": "111"
}

login_response = session.post(login_url, data=login_data)
print("Login:", login_response.status_code)


from flask import Flask, request, jsonify

url = "http://localhost/Backend/Events/insert_email_data.php"

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

# for the received email date (only date, without time)
def extract_just_date(iso_datetime_str):
    try:
        dt = datetime.fromisoformat(iso_datetime_str.replace("Z", "+00:00"))
        return dt.strftime("%Y-%m-%d")
    except ValueError:
        return None


# DD.MM.YYYY
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


# temporary change of date format to YYYY-MM-DD
def convert_date_temporary(date_str):
    try:
        for ro, en in month_translations.items():
            if ro in date_str.lower():
                date_str = re.sub(ro, en, date_str, flags=re.IGNORECASE)
                break

        for fmt in ("%d/%m/%Y", "%d.%m.%Y", "%d-%m-%Y", "%d/%m/%y", "%d.%m.%y", "%d-%m-%y",
                    "%d %B %Y", "%d %B, %Y", "%B %d, %Y", "%B %d %Y"):
            try:
                dt = datetime.strptime(date_str.strip(), fmt)
                return dt.strftime("%Y-%m-%d")
            except ValueError:
                continue
    except:
        pass
    return None

# HH:MM
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
        r"(?:în\s+data\s+de|in\s+data\s+de|data|date|on)?\s*[:\-]?\s*(\d{1,2}[\/\.\-]\d{1,2}[\/\.\-]\d{2,4})",
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
                extracted_date = convert_date_temporary(groups[0])
            elif len(groups) == 3:
                extracted_date = convert_date_temporary(f"{groups[0]} {groups[1]} {groups[2]}")
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



def extract_meeting_title(subject: str) -> str:
    subject = subject.strip()

    patterns = [

        # Sunteti invitati la ....  /  Va invitam la ... / Invitatie ... / Invitatie la evenimentul ...
        # eveniment/conferinta/festivitatea/intalnirea

        r'"([^"]+)"',
        r'“([^”]+)”',
        r'„([^”]+)”',
        r"[Ss]unte[țt]i invita[tț][ăai]?\s+la\s+[Ee]venimentul\s+(.*?)(?:\s*[\-|,\\/]\s*|\s+\d|$)",
        r"[Ss]unte[țt]i invita[tț][ăai]?\s+la\s+[Cc]onferin[tț]a\s+(.*?)(?:\s*[\-|,\\/]\s*|\s+\d|$)",
        r"[Ss]unte[țt]i invita[tț][ăai]?\s+la\s+[IÎiî]nt[âa]lnirea\s+(.*?)(?:\s*[\-|,\\/]\s*|\s+\d|$)",
        r"[Ss]unte[țt]i invita[tț][ăai]?\s+la\s+[Ff]estivitatea\s+(.*?)(?:\s*[\-|,\\/]\s*|\s+\d|$)",
        r"[Ss]unte[țt]i invita[tț][ăai]?\s+la\s+(.*?)(?:\s*[\-|:|,\\/]\s*|\s+\d|$)",

        r"[V][aă]\s+invit[ăa]m?\s+la\s+evenimentul\s+(.*?)(?:\s*[\-|,\\/]\s*|\s+\d|$)",
        r"[V][aă]\s+invit[ăa]m?\s+la\s+[Ff]estivitatea\s+(.*?)(?:\s*[\-|,\\/]\s*|\s+\d|$)",
        r"[V][aă]\s+invit[ăa]m?\s+la\s+[Cc]onferin[tț]a\s+(.*?)(?:\s*[\-|,\\/]\s*|\s+\d|$)",
        r"[V][aă]\s+invit[ăa]m?\s+la\s+[IÎiî]nt[âa]lnirea\s+(.*?)(?:\s*[\-|,\\/]\s*|\s+\d|$)",
        r"[V][aă]\s+invit[ăa]m?\s+la\s+(.*?)(?:\s*[\-|:|,\\/]\s*|\s+\d|$)",

        r"[Ii]nvita[țt]ie\s+la\s+[Ee]venimentul\s+(.*?)(?:\s*[-|,\\/]\s*|\s+\d|$)",
        r"[Ii]nvita[țt]ie\s+la\s+[Cc]onferin[tț]a\s+(.*?)(?:\s*[-|,\\/]\s*|\s+\d|$)",
        r"[Ii]nvita[țt]ie\s+la\s+[IÎiî]nt[âa]lnirea\s+(.*?)(?:\s*[-|,\\/]\s*|\s+\d|$)",
        r"[Ii]nvita[țt]ie\s+la\s+[Ff]estivitatea\s+(.*?)(?:\s*[-|,\\/]\s*|\s+\d|$)",

        r"[Ii]nvita[țt]ie\s+la\s+(.*?)(?:\s*[-|,\\/]\s*|\s+\d|$)",
        r"[Ii]nvita[țt]ie\s*[\|\-:@,]\s*(.*?)(?:\s*[\-|,\\/]\s*|\s+\d$)",
        r"[Ii]nvita[țt]ie\s+(.*?)(?:\s*[-|,\\/]\s*|\s+\d|$)",



        # You are invited to the event ... / We invite you to ... / Invitation ... / Invitation at ...
        # presentation/meeting/conference

        r"[Yy](?:ou\s+are|ou're)\s+invited\s+to\s+the\s+[Ee]vent\s+(.*?)(?:\s*[\-|:|,\\/]\s*|\s+\d|$)",
        r"[Yy](?:ou\s+are|ou're)\s+invited\s+to\s+the\s+[Cc]onference\s+(.*?)(?:\s*[\-|:|,\\/]\s*|\s+\d|$)",
        r"[Yy](?:ou\s+are|ou're)\s+invited\s+to\s+the\s+[Pp]resentation\s+(.*?)(?:\s*[\-|:|,\\/]\s*|\s+\d|$)",
        r"[Yy](?:ou\s+are|ou're)\s+invited\s+to\s+the\s+[Mm]eeting\s+(.*?)(?:\s*[\-|:|,\\/]\s*|\s+\d|$)",
        r"[Yy](?:ou\s+are|ou're)\s+invited\s+(?:to|at)\s+(.*?)(?:\s*[\-|:|,\\/]\s*|\s+\d|$)",

        r"[Ww]e\s+invite\s+you\s+to\s+the\s+[Ee]vent\s+(.*?)(?:\s*[\-|:|,\\/]\s*|\s+\d|$)",
        r"[Ww]e\s+invite\s+you\s+to\s+the\s+[Cc]onference\s+(.*?)(?:\s*[\-|:|,\\/]\s*|\s+\d|$)",
        r"[Ww]e\s+invite\s+you\s+to\s+the\s+[Pp]resentation\s+(.*?)(?:\s*[\-|:|,\\/]\s*|\s+\d|$)",
        r"[Ww]e\s+invite\s+you\s+to\s+the\s+[Mm]eeting\s+(.*?)(?:\s*[\-|:|,\\/]\s*|\s+\d|$)",
        r"[Ww]e\s+invite\s+you\s+(?:to|at)\s+(.*?)(?:\s*[\-|:|,\\/]\s*|\s+\d|$)",

        r"[Ii]nvitation\s+to\s+the\s+[Ee]vent\s+(.*?)(?:\s*[-:|,\\/]\s*|\s+\d|$)",
        r"[Ii]nvitation\s+to\s+the\s+[Cc]onference\s+(.*?)(?:\s*[-:|,\\/]\s*|\s+\d|$)",
        r"[Ii]nvitation\s+to\s+the\s+[Pp]resentation\s+(.*?)(?:\s*[-:|,\\/]\s*|\s+\d|$)",
        r"[Ii]nvitation\s+to\s+the\s+[Mm]eeting\s+(.*?)(?:\s*[-:|,\\/]\s*|\s+\d|$)",
        r"[Ii]nvitation\s+(?:to|at)\s+(.*?)(?:\s*[-:|,\\/]\s*|\s+\d|$)",

        r"[Ii]nvitation\s*[\|\-:@,]\s*(.*?)(?:\s*[\-|:|,\\/]\s*|\s+\d|$)",
        r"[Ii]nvitation\s+(.*?)(?:\s*[-:|,\\/]\s*|\s+\d|$)",
        r"(.*?)(?:\s*[-:|,\\/]\s*|\s+\d|$)"

    ]

    for pattern in patterns:
        match = re.search(pattern, subject)
        if match:
            return match.group(1).strip()

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

    patterns = [

        r"📍\s*(?:[Ll]oca[țt]i[ae][:\-]?\s*)?([A-Z][^.,\n]+)",
        r"📍\s*(?:Location[:\-]?\s*)?([A-Z][^.,\n]+)",
        r"[Ll]oca[țt]i[ae][:\-]?\s*?([A-Z][^.,\n]+)",

        r"\b[Ss]e\s+(?:va\s+)?desf[aă][șs]ura\s+(?:la|în)\s+([A-Z][^.,\n]+)",
        r"\b(?:[Vv]a\s+avea|[Aa]re)\s+loc\s+(?:la|în)?\s*([A-Z][^.,\n]+)",
        r"\bva\s+avea\s+loc\s+în\s+perioada\s+\d{1,2}-\d{1,2}\s+\w+\s+\d{4},?\s+în\s+([A-Za-zȘșȚțĂăÂâÎî\- ]+)",

        r"\bwill\s+take\s+place\s+during\s+the\s+period\s+\d{1,2}-\d{1,2}\s+\w+\s+\d{4},?\s+in\s+([A-Za-zȘșȚțĂăÂâÎî\- ]+)",
        r"\bwill\s+take\s+place\s+(?:at|in)\s+(?:the)\s+([A-Z][^.,\n]+)",
        r"\btakes\s+place\s+(?:at|in)\s+(?:the)\s+([A-Z][^.,\n]+)",
        r"\bis\s+held\s+(?:at|in)\s+(?:the)\s+([A-Z][^.,\n]+)",
        r"\bwill\s+be\s+held\s+(?:at|in)\s+(?:the)\s+([A-Z][^.,\n]+)",
        r"\bwill\s+be\s+hosted\s+(?:at|in)\s+(?:the)\s+([A-Z][^.,\n]+)",
        r"\bwill\s+happen\s+(?:at|in)\s+(?:the)\s+([A-Z][^.,\n]+)",
        r"\bhappens\s+(?:at|in)\s+(?:the)\s+([A-Z][^.,\n]+)",

        r"\bla\s+([A-Z][^.,\n]+)",
        r"\bîn\s+([A-Z][^.,\n]+)",
    ]

    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            locatie = match.group(1).strip()
            locatie = re.sub(r"[\.!\n,;]+$", "", locatie)
            return locatie

    return None




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
    email_date = extract_just_date(email_date)
    email_id = data.get("Message_ID")
    email_body = data.get("message_body")

    extracted_meeting_date, extracted_meeting_time = extract_date_time(email_body)
    extracted_meeting_title = extract_meeting_title(email_subject)
    extracted_meeting_location = extract_meeting_location(email_body)

    print(f"Subject: {email_subject}")
    print(f"From: {email_from}")
    print(f"CC: {email_cc}")
    print(f"BCC: {email_bcc}")
    print(f"Email date: {email_date}")
    print(f"Email ID: {email_id}")
    print(f"Body: {email_body}\n")

    print(f"Extracted meeting title: {extracted_meeting_title}")
    print(f"Extracted meeting location: {extracted_meeting_location}")
    print(f"Extracted meeting date: {extracted_meeting_date}")
    print(f"Extracted meeting time: {extracted_meeting_time}")

    insert_url = "http://localhost/Backend/Events/insert_email_data.php"
    data = {
        'message_id': email_id,
        'sender': email_from,
        'subject': email_subject,
        'send_date': email_date,
        'meeting_title': email_subject,
        'meeting_location': extracted_meeting_location,
        'meeting_time': extracted_meeting_time,
        'meeting_day': extracted_meeting_date,
        'cc': email_cc,
        'bcc': email_bcc
    }

    response = session.post(insert_url, data=data)
    print("Insert:", response.status_code)
    print(response.text)

    return jsonify({"status": "received"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


