# intent_data.py

TRAIN_DATA = [
    # donate_inquiry
    ("How can I donate?", {"cats": {"donate_inquiry": 1.0}}),
    ("Where do I send my donation?", {"cats": {"donate_inquiry": 1.0}}),
    ("I want to contribute to your cause.", {"cats": {"donate_inquiry": 1.0}}),
    ("Tell me how to donate.", {"cats": {"donate_inquiry": 1.0}}),
    ("How do I give money to Unity?", {"cats": {"donate_inquiry": 1.0}}),
    ("Can I donate online?", {"cats": {"donate_inquiry": 1.0}}),
    ("Is there a donation form?", {"cats": {"donate_inquiry": 1.0}}),
    ("I'd like to donate.", {"cats": {"donate_inquiry": 1.0}}),
    ("What’s the best way to donate?", {"cats": {"donate_inquiry": 1.0}}),
    ("Can I support financially?", {"cats": {"donate_inquiry": 1.0}}),

    # donation_tax
    ("Is my donation tax-deductible?", {"cats": {"donation_tax": 1.0}}),
    ("Will I get a tax receipt?", {"cats": {"donation_tax": 1.0}}),
    ("Can I claim my donation on taxes?", {"cats": {"donation_tax": 1.0}}),
    ("Do you provide donation receipts?", {"cats": {"donation_tax": 1.0}}),
    ("Are donations tax exempt?", {"cats": {"donation_tax": 1.0}}),
    ("Is Unity a 501(c)(3)?", {"cats": {"donation_tax": 1.0}}),
    ("Can I use my donation as a tax write-off?", {"cats": {"donation_tax": 1.0}}),
    ("Does Unity provide tax documentation?", {"cats": {"donation_tax": 1.0}}),
    ("Can I file my donation for taxes?", {"cats": {"donation_tax": 1.0}}),
    ("What’s the tax status of my gift?", {"cats": {"donation_tax": 1.0}}),

    # volunteer_interest
    ("Do you need help with anything?", {"cats": {"volunteer_interest": 1.0}}),
    ("Can I assist as a volunteer?", {"cats": {"volunteer_interest": 1.0}}),
    ("I’d love to volunteer my time.", {"cats": {"volunteer_interest": 1.0}}),
    ("Where can I sign up to help?", {"cats": {"volunteer_interest": 1.0}}),
    ("I want to join your team as a volunteer.", {"cats": {"volunteer_interest": 1.0}}),
    ("Are there any ways I can volunteer?", {"cats": {"volunteer_interest": 1.0}}),
    ("What do I need to do to volunteer?", {"cats": {"volunteer_interest": 1.0}}),
    ("Is volunteering possible remotely?", {"cats": {"volunteer_interest": 1.0}}),
    ("Can I contribute my skills as a volunteer?", {"cats": {"volunteer_interest": 1.0}}),
    ("I'd like to support Unity by volunteering.", {"cats": {"volunteer_interest": 1.0}}),
    ("I want to volunteer.", {"cats": {"volunteer_interest": 1.0}}),
    ("How can I help as a volunteer?", {"cats": {"volunteer_interest": 1.0}}),
    ("Do you need volunteers?", {"cats": {"volunteer_interest": 1.0}}),
    ("How can I support as a volunteer?", {"cats": {"volunteer_interest": 1.0}}),
    ("I have time to volunteer, how do I start?", {"cats": {"volunteer_interest": 1.0}}),
    ("Where do I sign up to volunteer?", {"cats": {"volunteer_interest": 1.0}}),
    ("Can I help out in person?", {"cats": {"volunteer_interest": 1.0}}),
    ("Is there an online volunteer option?", {"cats": {"volunteer_interest": 1.0}}),
    ("How do I join your team as a volunteer?", {"cats": {"volunteer_interest": 1.0}}),
    ("I'd like to offer my skills.", {"cats": {"volunteer_interest": 1.0}}),

    # program_info_afghanistan
    ("What do you do in Afghanistan?", {"cats": {"program_info_afghanistan": 1.0}}),
    ("Tell me about your Afghan programs.", {"cats": {"program_info_afghanistan": 1.0}}),
    ("What are your operations in Afghanistan?", {"cats": {"program_info_afghanistan": 1.0}}),
    ("Do you support communities in Afghanistan?", {"cats": {"program_info_afghanistan": 1.0}}),
    ("Are you working in Kabul?", {"cats": {"program_info_afghanistan": 1.0}}),
    ("Is Unity active in Afghanistan?", {"cats": {"program_info_afghanistan": 1.0}}),
    ("Do you do outreach in Afghanistan?", {"cats": {"program_info_afghanistan": 1.0}}),
    ("How do you help people in Afghanistan?", {"cats": {"program_info_afghanistan": 1.0}}),
    ("Are there any school programs in Afghanistan?", {"cats": {"program_info_afghanistan": 1.0}}),
    ("What's your mission there?", {"cats": {"program_info_afghanistan": 1.0}}),

    # program_info_digital
    ("Tell me about your digital literacy work.", {"cats": {"program_info_digital": 1.0}}),
    ("What is your digital program?", {"cats": {"program_info_digital": 1.0}}),
    ("How do you teach tech skills?", {"cats": {"program_info_digital": 1.0}}),
    ("Do you offer computer training?", {"cats": {"program_info_digital": 1.0}}),
    ("Are there digital classes?", {"cats": {"program_info_digital": 1.0}}),
    ("What is your computer skills program?", {"cats": {"program_info_digital": 1.0}}),
    ("Do you teach people about technology?", {"cats": {"program_info_digital": 1.0}}),
    ("What do you do to help with digital access?", {"cats": {"program_info_digital": 1.0}}),
    ("Do you offer any online learning?", {"cats": {"program_info_digital": 1.0}}),
    ("Are there tech workshops?", {"cats": {"program_info_digital": 1.0}}),

    # refugee_support
    ("Do you help Afghan refugees?", {"cats": {"refugee_support": 1.0}}),
    ("What services do you have for refugees?", {"cats": {"refugee_support": 1.0}}),
    ("Can refugees contact you?", {"cats": {"refugee_support": 1.0}}),
    ("Are there resources for refugees?", {"cats": {"refugee_support": 1.0}}),
    ("How do you support displaced people?", {"cats": {"refugee_support": 1.0}}),
    ("Is there refugee help available?", {"cats": {"refugee_support": 1.0}}),
    ("Do you assist asylum seekers?", {"cats": {"refugee_support": 1.0}}),
    ("Do you provide housing help?", {"cats": {"refugee_support": 1.0}}),
    ("What kind of support do refugees get?", {"cats": {"refugee_support": 1.0}}),
    ("Can refugees reach out for help?", {"cats": {"refugee_support": 1.0}}),

    # contact_us
    ("How can I contact someone?", {"cats": {"contact_us": 1.0}}),
    ("Can I speak with a team member?", {"cats": {"contact_us": 1.0}}),
    ("How do I reach out to Unity?", {"cats": {"contact_us": 1.0}}),
    ("Is there an email or phone number?", {"cats": {"contact_us": 1.0}}),
    ("Can I get in touch with you?", {"cats": {"contact_us": 1.0}}),
    ("Is there a way to message Unity?", {"cats": {"contact_us": 1.0}}),
    ("How do I contact your organization?", {"cats": {"contact_us": 1.0}}),
    ("I want to talk to someone at Unity.", {"cats": {"contact_us": 1.0}}),
    ("Is there a contact form?", {"cats": {"contact_us": 1.0}}),
    ("Where can I leave a message?", {"cats": {"contact_us": 1.0}}),

    # event_info
    ("Are there any upcoming events?", {"cats": {"event_info": 1.0}}),
    ("Tell me about your latest events.", {"cats": {"event_info": 1.0}}),
    ("What events are happening soon?", {"cats": {"event_info": 1.0}}),
    ("Can I attend your community programs?", {"cats": {"event_info": 1.0}}),
    ("Is there an event calendar?", {"cats": {"event_info": 1.0}}),
    ("Do you host any events?", {"cats": {"event_info": 1.0}}),
    ("Are there volunteer events?", {"cats": {"event_info": 1.0}}),
    ("What’s happening next week?", {"cats": {"event_info": 1.0}}),
    ("How can I join an event?", {"cats": {"event_info": 1.0}}),
    ("Any events I should know about?", {"cats": {"event_info": 1.0}}),

    # language_switch
    ("Can we continue in Dari?", {"cats": {"language_switch": 1.0}}),
    ("I want to speak Dari.", {"cats": {"language_switch": 1.0}}),
    ("Can you talk in another language?", {"cats": {"language_switch": 1.0}}),
    ("Do you support Persian?", {"cats": {"language_switch": 1.0}}),
    ("Can I change the language to Dari?", {"cats": {"language_switch": 1.0}}),
    ("Is Dari available?", {"cats": {"language_switch": 1.0}}),
    ("Can I continue this chat in Farsi?", {"cats": {"language_switch": 1.0}}),
    ("Switch to Dari.", {"cats": {"language_switch": 1.0}}),
    ("Talk to me in my language.", {"cats": {"language_switch": 1.0}}),
    ("Can I use my native language?", {"cats": {"language_switch": 1.0}}),

    # mission_overview
    ("What’s your mission?", {"cats": {"mission_overview": 1.0}}),
    ("What does Unity to Serve do?", {"cats": {"mission_overview": 1.0}}),
    ("Tell me about your organization.", {"cats": {"mission_overview": 1.0}}),
    ("What is your purpose?", {"cats": {"mission_overview": 1.0}}),
    ("Why was Unity created?", {"cats": {"mission_overview": 1.0}}),
    ("What are your goals?", {"cats": {"mission_overview": 1.0}}),
    ("Give me a summary of Unity to Serve.", {"cats": {"mission_overview": 1.0}}),
    ("Tell me about your work.", {"cats": {"mission_overview": 1.0}}),
    ("What is the vision of Unity to Serve?", {"cats": {"mission_overview": 1.0}}),
    ("What do you aim to achieve?", {"cats": {"mission_overview": 1.0}}),
]

INTENTS = [
    "donate_inquiry", "donation_tax", "volunteer_interest", "program_info_afghanistan",
    "program_info_digital", "refugee_support", "contact_us", "event_info",
    "language_switch", "mission_overview"
]
