INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (93, 'Issue 93 – Summer 2026: Architects putting people and planet first!', 'magazines/covers/issue-93.jpg', 'magazines/issue-93.pdf', 'News : New Irish and EU anti-poverty strategies.
MOYROSS: The Berlin Wall came down faster.
THE MCCONVILLES: Like father, like son.
EU: Highlighting where we excel.
MINISTER AGREES: No medicine is a match for social farming.
‘Miasma’ : Colin Murphy’s new play perfect in community settings.
Anna Moore : The Mammy of Irish Boxing.
women IN POLITICS : Plan now for 2029.
WHEEL SUMMIT: Minister Buttimer, Séamus Boland & more.
CambodiAN visitors: Spotlight on our co-ops.
Social Enterprise: Seeking a ‘New Deal’
LEADER : Campaigners raise concerns.
COMMUNITY CONNECTIONS : Interview with Catherine Lane.
ukraine – IReland : Armen’s volunteering story.
LEADER in Carlow: Outdoors hub success.
Celebrations : LGBTQ+ Pride, Africa Day & Traveller Pride.', '2026-08', 93)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (92, 'Issue 92 – Spring 2026: We Want Change Before We Die!', 'magazines/covers/issue-92.png', 'magazines/issue-92.pdf', 'LEAD STORY – WE WANT CHANGE BEFORE WE DIE!
• NEWS : – €4m for rural social enterprise through PEACEPLUS. • WE WANT CHANGE BEFORE WE DIE!
– Community worker provides an unique perspective. – ‘Before We Die’ founder Tony Murray tells his family’s story. – Taoiseach commits to act on issues raised. – Revisit policies, suggests Des North, St John of God.
• IT’S A START! An apprenticeship for non-profit administrators by 2027 • 10 PROJECTS JOIN FAMILY RESOURCE CENTRE PROGRAMME. • COMMUNITY & COUNCIL AWARDS. • SOUTHSIDE PARTNERSHIP has a new plan. • URBAN FOOD POVERTY: Shocking data led to Dublin 10 Food Alliance. • RURAL POLICY: OECD publish report. • SOCIAL FARMING EXPANDS: News updates from Social Farming Ireland and Kerry Social Farming. • CO-OPERATIVES OFFER MORE TO OUR ELDERLY POPULATION: UCC researchers explain how. • THE GREAT CARE CO-OP: Making carers more visible. • JOBS EXPO FOR THOSE EXPERIENCING BARRIERS: Organisers surprised by turnout. • 35 YEARS OF NEWS: Travellers’ Voice magazine. • ALL GO IN SKIBBEREEN: New model for engaging men. • BOXING FOR KIDS WITH ADDITIONAL NEEDS: The High Five Boxing Academy. • LEARNING BEHIND BARS: Changing Ireland a guest of Limerick Prison Education Service.', '2026-04', 92)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (91, 'Issue 91 – Winter 2025: Fighting for Change in Dublin 8', 'magazines/covers/issue-91.png', 'magazines/issue-91.pdf', 'LEAD STORY – CRAIG O’BRIEN: Fighting for Change.
NEWS: President Zelenskyy meets community workers.
CRAIG O’BRIEN: Fighting for change.
TRAVELLER-LED HOUSING: Co-launched in Galway.
SOLUTION: To prevent older people becoming homeless.
COMMUNITY CAFES GET ORGANISED
Southill Cafe, Limerick: “We are victims of our own success”.
Crosscare Cafe, Dublin: “The costs are going up”.
‘They give up after a few tries’: Difficulties opening bank accounts is holding many people back from Tús opportunities.
ALICE ANN LEE: The invisible work keeping families together.
LOCAL DEVELOPMENT COMPANIES: Two-day conference held in Ballina.
4th NATIONAL CIVIC FORUM: Strong views in Cork on a stormy day.
COMMUNITY RADIO: Scariff gets full broadcast licence.
VOLUNTEERS: Accuse Charities Regulator of being “unrealistic”.
‘IN OUR WORDS’ SICAP STORIES: With Eileen McHugh, Sabrina Whelan and Damien Quinn.
SOCIAL ENTERPRISE: Essential for former prisoners.
GRATEFUL AMIDST GRIEF: Ukrainians adapting to living in Sligo.
ROOFTOP GARDEN IN GALWAY: Spuds boost morale.
LEARNING CURVE: Swimming in acronyms!
TRALEE COFFEE POD: Connects refugees to work and to locality.
ERRIS: Disappointment to miss out on FRC approval.
What is bio-regioning? We do our best to explain!', '2026-04', 91)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (90, 'Issue 90 – Autumn 2025: What does community mean to us?LEAD STORY – GEMMA DUNLEAVY: “Community to me means soil.', 'magazines/covers/issue-90.png', 'magazines/issue-90.pdf', 'LEAD STORY – GEMMA DUNLEAVY: “Community to me means soil”.
News : – Senan Cooke honoured at first ever national social enterprise awards (See page 31 for full results).
SALARIES : Staff quitting grassroots community jobs.
Budget 2026 sees DRCDG get €611m.
Gold standard in climate action: Dolphin House, Dublin.
LIBERTIES LEADER: Fr. Michael Mernagh on Haughey, being jailed and more
LITTLE LIBRARIES: Where are they coming from?
INFLUENCERS: EU backs Kildare integration work.
GENOCIDE AND IRISH CIVIL SOCIETY SURVEY.
IN OUR WORDS: Social Inclusion and Community Activation Programme showcase
CLONDALKIN: Responding to drug-related gang intimidation.
MENTAL HEALTH: ‘No Shame Board Game’ gets young Travellers talking.
BALLINACURRA PROMISES: Minister Calleary visits Limerick.
Gabriel o’Connell: The Interview.
Have cash, no account : Small community groups struggle with banks.
Local Community Development Committees: Annual networking.
QUEER IRELAND: “Huge allyship” shown.
APPLES: Celebrating community orchards.
The pandemic left a mark on rural Ireland : Some groups only returned to action this year', '2026-01', 90)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (89, 'Issue 89 – SPRING 2025: HOW TO CHANGE A CITY', 'magazines/covers/issue-89.png', 'magazines/issue-89.pdf', 'HOW DO YOU CHANGE A CITY? With hundreds of volunteer community gardeners!
LEAD: 25 community gardens across Cork city
NEWS: Local authorities now legally obliged to support community gardens.
Integration: Letter Lingo from Leitrim.
News: – Forsa approves pay deal.
Interview: Green Spaces co-ordinator Maria Young.
Interview: Carol Baumann on a life in development.
Moyross Youth Academy: Voices from the saddle.
Climate Justice: Justice Centre grows in 5 years
WARNING: Populism rising amidst poverty and plenty.
POLICY: Social Inclusion Forum 2025.
ADVOCACY: Senior Citizens Parliament co-ordinator Pat Mellon.
WHEEL SUMMIT: Taoiseach condemns Israel’s murder of volunteers.
Traveller pride: Who did what?
Dublin: Bernie Roche is Community Volunteer of the Year.
Going solar: Dunshaughlin Community Centre saves €14k p.a.
Youth: No Name Clubs going 50 years.
News: Toolkits to boost inclusive employment.
Local authorities: Humans of Dublin City.
Empowerment: UL nurtures new community leaders.
Human rights: Uisce Cliste.
Best Practice: Balbriggan wins award for “great places” map.', '2026-03', 89)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (88, 'Issue 88 – SPRING 2025: FIERCE FUNDRAISERS', 'magazines/covers/issue-88.png', 'magazines/issue-88.pdf', 'FIERCE FUNDRAISERS – The A-to-Z of establishing a social enterprise hub in Dublin’s inner city
Community workers say we should learn from Britain’s experience
Food brings people together in Tullow.
12 things I now know about Ukrainians and their fab country.
Clones children’s project has a telling impact.
INTERVIEW: Minister of State Jerry Buttimer on inclusion.
TWO DEPARTMENTS: Minister Dara Calleary busy from first day.
REBRAND: The ILDN is now the LDCN.
NATIONAL CIVIC FORUM:
Mary Hurley highlighted recent achievement.
Increase in poverty pushing children into criminality in Dublin.
Sláintecare Health and Communities Programme: Community workers see progress by listening to people.
NEWS: Pay deal for Section 39 workers.
SOLIDARITY: Irish community worker visits Palestinian farmers.
SOUTH KERRY GAELTACHT: Arty approach to housing solution.
FETTERCAIRN: Youth and Horse project is thriving.
WICKLOW: Community development in addiction recovery.
WINNERS – 2025 Aontas awards.
THE SECRET COMMUNITY DEVELOPMENT WORKER – It’s 2027 and us Irish are refugees.
NEWS: Why groups are boycotting Twitter (aka X).', '2025-05', 88)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (87, 'Issue 87 – WINTER 2024: Sharing Culture Trumps Fear', 'magazines/covers/issue-87.png', 'magazines/issue-87.pdf', 'SHARING CULTURE TRUMPS FEAR – Culture workshops in Wexford / Pride in Kilkenny.
COOLOCK: Jim Lillis, one of Ireland’s longest-serving chairs, interviewed. Speedpak goes international.
NEWS: Budget increase for early years workers welcomed.
NEWS: 10 years of PPNs.
FUNDING: Volunteer Centres / Rural regeneration.
COMMUNITIES AND LOCAL AUTHORITIES: Extra staff help local authorities apply for grants.
COMMUNITY PROJECTS PROVE WORTH: Showcase in Athlone of 27 projects supported by the Empowering Communities Programme and the Community Development Programme.
SOCIAL IMPACT: Waterford Area Partnership shows impact of community work.
MEDIA RESOURCES – Podcasting support / Tips for videos.
CLIMATE – Inishowen communities drawn to positivity.
FUTURE FUNDING – ILDN calls to restore community funding levels.
TRAVELLER ACCOMMODATION – CENA building in Galway.
WINNERS – Student awards / Tidy Towns.
FINANCIAL INCLUSION – Northside Partnership offers training and toolkit.
THE SECRET COMMUNITY DEVELOPMENT WORKER – People at Meetings – Part 1.
LOCAL AUTHORITY NEWS', '2024-12', 87)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (86, 'Issue 86 – AUTUMN 2024: Ní neart go cur le chéile', 'magazines/covers/issue-86.png', 'magazines/issue-86.pdf', 'COMMUNITY TRAUMA EXAMINED
POVERTY: We need more people employed to help vulnerable children.
NEWS: Screenhouses in Meath, Queer Sheds in Clare, Clann Credo’s €215m and Library Briefs.
FUNDING: Four recent community funding announcements.
COOLOCK: Overwhelmingly enthusiastic response to Kelly’s essay.
WELCOMING NEW COMMUNITIES – conference report: Tim Dixon’s tips based on science.
30 new jobs to counter disinformation.
Vital work highlighted.
10 video resources.
Leitrim shows how integration is made easier by volunteering.
GOVERNMENT UNDERMINES INTEGRATION: Moving refugees is undermining integration and volunteering.
RURAL SOCIAL SCHEME AT 30 – Steve Dolan writes.
CHANGING IRELAND TOGETHER – Shauna McClenaghan from Inishowen.
WELLBEING / MENTAL HEALTH – Project in Dundalk tries art, Birr project goes outdoors, Donegal FRCs take to mountaintop – and all are exceptional.
LOUTH URBAN FOOD SANCTUARY
THE SECRET COMMUNITY DEVELOPMENT WORKER – NEW COLUMN
LOCAL AUTHORITY NEWS', '2024-10', 86)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (85, 'Issue 85 – SUMMER 2024: DUBLIN RESIDENTS STRESS HUMAN RIGHTS', 'magazines/covers/issue-85.png', 'magazines/issue-85.pdf', 'Dolphin House community warns of breaking point over regeneration delays.
PLUS – Rural communities in Ireland, Portugal, Finland and Slovenia learning to be more resilient.
LET’S LEAD IN EQUALITY AND HUMAN RIGHTS appeals Robert Carey.
COMMUNITY WORKERS HAVE A DUTY TO SPEAK UP says Noel Wardick.
10 MILLION EUROPEANS LIVE IN HUMAN RIGHTS GREY ZONES writes Andrew Forde.
CIVIL SOCIETY CALLS FOR PEACE – Protests leading to boycott of Israeli firms.
REPEAL DISABILITY ACT – say campaigners after victory over tiered payments.
CLIMATE CHANGE: “WHAT DIFFERENCE CAN I MAKE?” – Youghal’s blue and green network values action.
WATERFORD HOMES DESERVE RETROFITTING – Strong community but homes are draughty.
AWARD FOR LGBT+ PROJECT IN SLIGO – as national survey reports “stark deterioration” in mental health.
FIRST CHURCH TO INSTALL SOLAR ROOF PANELS – Fethard-on-Sea’s bills now negligible.
€4M IN RURAL FUNDS FOR GLENAMADDY
UKRAINIAN INTEGRATION – Supporting Ukrainians in Kerry is of national interest.
Pilot Podcast: Brendan O’Loughlin talks climate justice in Offaly, Michael D and Mayo football.
MENTAL HEALTH WORK IN MEATH – some surprising issues emerge.
RURAL RESILIENCE – Erasmus+ seminar on community resilience.
Letterfrack international conference.
New bursary for rural development.
BALLYFERMOT GROUP REBRANDS ITSELF
LOCAL AUTHORITY NEWS
HORACE – Always look on the bright side of life!', '2024-07', 85)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (84, 'Issue 84 – SPRING 2024: The Social Model of Disability', 'magazines/covers/issue-84.png', 'magazines/issue-84.pdf', 'LEAD: Boats, gyms, money, no problem with the Social Model of Disability.
PLUS – A SPECIAL REPORT FROM COUNTY DONEGAL.
Food poverty – Volunteers heading to Dáil.
Lough Ree’s accessible boats
Financial inclusion training in a Dublin flat – Group develops handbook for people with intellectual disabilities.
Gym has equality lessons for Europe.
Steering young drivers to safety – Recommended LEADER project
Donegal Local Development has a new view.
Shared office support services model launched.
Árainn Mhór joy over “best project in 20 years”.
Ukrainian integration on Árainn Mhór: “We’d take 100 more people”.
First baby born on island since 1970s; we meet the dad!
War refugees describe island life.
Community worker sees untapped potential.
Recognition in new €50m Community Fund.
One million stars project for hope, light and solidarity.
Creeslough Hub is “another step towards healing”
UKRAINIAN INTEGRATION: Tania’s working life in Ireland
€45k awards for measuring social impact: Tips from the winners.
Ballinasloe LIFE editor writes about how community media are battling the democratic deficit.
Social enterprises employing ex-prisoners – from serving sentences to serving cappuccinos.
Travellers and Climate justice – an overlooked minority
Food poverty Q&A
Solidarity
Calls to re-run volunteer programme
Local authority news', '2024-04', 84)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (83, 'Issue 83 – Winter 2023/’24: Grassroots community workers say the State did not listen', 'magazines/covers/issue-83.png', 'magazines/issue-83.pdf', 'LEAD STORY: Grassroots community workers say – The State did not listen.
Dublin troubles: Community organisations call for action
Map shows Rich-Poor gap widening
Good reads: Start 2024 with a book from your favourite community worker
Bernadette McAliskey: If you’re afraid to speak out now, you will fail your community
Irish civil society: 200 groups call for peace in Gaza
Roma women’s health: Pavee Point play crucial role
Community radio in Ireland: Concerns over future funding
Cena housing Stylish outdoorsy Traveller-built accommodation emerges
Men’s sheds: €1m funding boost
Femicide: Women’s Aid calls for zero tolerance
Animal welfare in the community: Leitrim loves its pets
Darndale/Drogheda: New respect between residents and Gardaí
Social Enterprise national conference
Pride of Place winners / What’s happening in Lisdoonvarna?
Climate & communities: Siobhán Mehigan from Wicklow reports on a recent gathering
Values and principles: Community-State civic forum becomes an annual event
Corkonians hope to compete for national title in 2024
Horace: Exclusive from Cop 28.
Local authority news', '2024-02', 83)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (82, 'Issue 82 – Autumn 2023: Unique agency Pobal is 30 years old', 'magazines/covers/issue-82.png', 'magazines/issue-82.pdf', 'LEAD STORY: “People in communities are the heroes , we are just a bridge” – Anna Shakespeare on Pobal at 30
NEWS: Budget 2024 and reaction – 8
TRISHAW RIDING: It costs a lot, yet is becoming popular – 9
What is a SOCIAL PRESCRIBER? Pauline Mangan explains all! – 10
MUTE ADVOCATES Freedom to advocate curtailed by some funders – 11
PLOUGHING PEOPLE 2023: – 12-16
Community INTEGRATION: First event of its kind saw people make new friends fast – 17
EVERYONE WANTS PEACE: Community workers Julia and Marie Louise describe integration work in County Wexford – 18-19
STEAL AWAY: Ukrainians here embrace song about The Troubles – 20-21
COST OF LIVING: Cash is king – 21
What is the CIRCULAR ECONOMY? Six examples – 22-23
Advocacy & Employment: Expanding mental health supports in Kildare – 24-25
HORACE MCDERMOTT: Vampires in rural Ireland – 25
ACTIVISM TIPS: Anti-fascism report draws on experience – 26
HOMELESS – VOICES OF SOLIDARITY – 27
ICELAND TO GALWAY: A Nordic solution to an Irish problem – 28-2
VOLUNTEERING: Kieran Jordan on the joy of reaching out – 30
ERASMUS+ in Donegal-Derry – 31
LOCAL AUTHORITY NEWS – 32', '2023-11', 82)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (81, 'Issue 81 – Summer 2023: Why Communities Love Summer', 'magazines/covers/issue-81.png', 'magazines/issue-81.pdf', 'LEAD STORY –Why Communities Love Summer
AI PROMISE & THREAT
Welcome for islands strategy
Pobal’s 30 years – Events coming in Galway and Dublin
ILDN’s new team.
Tasc at 21.
LEAD STORY – Creating community space indoors and outdoors
Think co-operatively – Who will go first, ask UCC students
Multiple warnings – Increase pay or community services will collapse
25 YEARS OF FAMILY RESOURCE CENTRES – Why we need €3.3m more this year
Retrofitting four counties – Community solution to private sector disinterest in rural areas
Travellers get voice back after a silent decade – Community Development Projects expanding
Networking – Galway wants to know are you doing what they’re doing?
Community Recognition Fund
Integration and Community Champions in Cavan and Monaghan
BOOK REVIEW – Legendary lessons from disability activists
People – Why is Ivan Cooper like a magpie?
Darndale and Drogheda – Two novel community-based initiatives make impact.
Social inclusion forum
Volunteers – from Ballina to Kildare', '2023-07', 81)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (80, 'Issue 80 – Spring 2023: Build Homes Not Hate', 'magazines/covers/issue-80.png', 'magazines/issue-80.pdf', 'LEAD STORY – Solidarity Rally Speeches You Didn’t Hear About
IT’S NOT THEM OR US, says Martin Collins
Clear message of anti-racism.
Thanks Dublin says Lucky Khambule.
One question from Bernadette Devlin.
Cork’s Mexicans feel at home.
Dublin’s Muslim sisters volunteer for all.
Polish in the Midlands connect via tv.
Communities to have more say – says Government
Queer Ireland – People grateful to 300 champions; LGBT+ organisations are working to tackle isolation
Travellers’ lives matter – Donegal Travellers launch research findings.
Community cars won’t drive themselves – Volunteers pivotal to success
Recovery through community employment – Killian and Geraldine tell their stories.
Changing Westmeath – Moate volunteers raise a million and turn cowpark into tourism attraction.
Is Monaghan the most Irish town in Ireland – Yes, say some locals
HORACE MCDERMOTT – We’re on the move folks!
LOCAL AUTHORITY NEWS', '2023-03', 80)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (79, 'Issue 79 – WINTER 2022/’23 – Salaries & Staffing Crisis', 'magazines/covers/issue-79.png', 'magazines/issue-79.pdf', 'Winter 2022/’23
LEAD STORY: Salaries & Staff Retention Warning.
VALUES AND PRINCIPLES: Better relations promised between State and C&V Sector.
CLIMATE ACTION: Tipperary project setting a lead.
WINNERS: Changemakers Pitch-Fest.
FAMILY SUPPORT: Erris community secures funding / Tusla explains background.
CIVIC FORUM: Taoiseach attends opening of dialogue with civil society.
QUEER IRELAND: Inside Dublin’s Outhouse.
POST-COVID RECOVERY: Groups still nervous to reopen.
REFUGEES: Inishowen’s new workers from Ukraine wish to help everyone.
SOCIAL ENTERPRISE: Three counties work together.
SPORTS AND COMMUNITY DEVELOPMENT: Kerry boxing club wins on streets.
ADVICE: Groups urged to measure their social impact.
GREEN OFFALY: Faithful county takes Welsh path.
RURAL IDEAS: 100 people propose solutions.
ERASMUS+: One young man’s experience.
An Cosán: 20,000 graduates to date and strong appeal to community development groups.
REMOTE WORKING: Now over 300 Remote Working Hubs are Connected.
LOCAL AUTHORITY NEWS', '2023-03', 79)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (78, 'Issue 78: Rethink Plastic & Rethink Development', 'magazines/covers/issue-78.png', 'magazines/issue-78.pdf', 'Autumn 2022
News: Inchicore CDP experiences violence.
Early Years Pay Win for SIPTU Members.
Social Enterprise survey.
PLOUGHING – Pictorial coverage: Junk Kouture.
The Future is in the Fields.
‘Tis great to see people in 3-D.
DAMIEN QUINN of Spéire Nua: “I say it all the time – prison was the easy part.”
RURAL DEVELOPMENT: Views from Columbia, Czech Rep, the USA, Sweden, Finland.
Taoiseach on inclusion, optimism & a just transition.
O’Brien tells 38 country reps about Gov’s social inclusion work.
WHAT WILL YOUR LEGACY BE? Youth leadership in Dublin.
INEQUALITY: Class and Education in Dublin.
CLANN CREDO: Athlone Boat Club / 36 tips to manage rising costs.
Youthwork: More ethnic minority youth workers needed.
One of the best: Killarney Men’s Shed.
Pre & Post-Budget Analysis: With SVP, Dóchas, Inclusion Ireland, Irish Traveller Movement, Social Justice Ireland.
Ireland/Ukraine:
Refugee Factcheck.
Tree of Peace.
Interviews.
Moate: “The best thing in our community in 37 years.”
21st Anniversary: Changing Ireland hailed for “track record.”
Horace: Unparalleled insights.', '2022-10', 78)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (77, 'Issue 77: Summer 2022-Listen to the Grassroots', 'magazines/covers/issue-77.png', 'magazines/issue-77.pdf', 'LEAD STORY – Brian Harvey says we ignore FRC insights at our peril
REFUGEES & COMMUNITY DEV’T: €10.5M EXTRA for community work supporting Ukrainians.
Relief as social inclusion funds will no longer be diverted.
Govt agrees on how to work best with Community & Voluntary Sector.
Refugees who volunteer.
BOOK: ‘No Child Shall Suffer’: 14 real-life stories documenting poverty in Dublin’s inner-city.
DEVELOPMENT EDUCATION IN INISHOWEN: ChangeMakers’ model of good practise.
EARLY YEARS / CE, Tús & RSS: Katie Barr on why we need more men and better pay.
Reforms to RSS, Tús & CE schemes.
IRELAND WINS UN AWARD: For community work.
SOCIAL FARMING: 8 reasons to be hopeful.
VOLUNTEERING: Two new volunteer centres open.
81 GROUPS RECEIVE SSNO FUNDING
SOCIAL ENTERPRISE
New €2m Empowering Communities Prog.
50th Anniversary of RnaG: 6 positive things happening with the Irish Language.
DONEGAL – PANDEMIC POSITIVES: Arts group formed in lockdown wants to stay online.
HORACE MCDERMOTT: Unparalleled insight.', '2022-10', 77)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (76, 'Issue 76: Ireland, the land of 100,000 welcomes – but 200,000?', 'magazines/covers/issue-76.png', 'magazines/issue-76.pdf', 'COVER: Solidarity with refugees.
REFUGEES: Pages 5-9.
21 reasons why Ireland is a better place today for taking in refugees. On the other hand…
Ukrainians need firm information.
Hosting: We’ve taken in 4 people.
VOLUNTEERING: 10-11.
New Volunteer Centre in Offaly.
Couple volunteering since 1975.
DOMESTIC VIOLENCE SUPPORT SERVICES: 12-15.
Offaly staff get calls from worldwide.
Ethnic minority project a model for others.
West Cork publishes 80th newsletter.
HUMAN RIGHTS: 16 & 18-19.
2002 law still denying Travellers the right to nomadic life.
Self-employment for people with disabilities.
“If they did it, so can I” – Christina McDonald, owner of Grá-Nua.
FUNDING: 17.
€15m for Community Centres.
Calendar of Dept’s funding deadlines.
MEATH: 20-24.
Community workers showcase.
Success with Navan schoolbus.
MENTAL HEALTH: 23 & 26.
SoSad: Every county should have one.
Independent services in West Cork.
LEADERSHIP: 28.
Pilot in Darndale & Drogheda: 24 people start new community leadership prog.', '2022-06', 76)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (75, 'Issue 75: A Stable Bond-Youthwork Proves Its Worth', 'magazines/covers/issue-75.png', 'magazines/issue-75.pdf', 'COVER: A Stable Bond.
LEAD STORY: Youthwork & Moyross jockey Wesley Joyce.
OUTDOORS: Funding for 84 adventure spots.
UNIONS: Seek 3% pay rise for community workers.
SOCIAL ENTERPRISE: Humphrey’s promises more support.
COMMUNITY CLIMATE ACTION PROG: Details of €5m+.
WESTMEATH: One great thing!
FOOD: Pizza & Food Forests.
REGENERATION NOT: O’Devaney Gardens 17 years on.
REFUGEES: Cape Clear is ready.
COMMUNITY RADIO: President on 25 years.
DEMENTIA INCLUSIVE: Near FM’s dedicated programme.
CO-OPS: Olive McCarthy interview.
EAMON O’CUIV, TD: Make Tus work better.
JOHN BAWLE, MULLINGAR: “My head was gone”.
SMART VILLAGES: EU pushes digital.
HORACE: No masking the truth.', '2022-01', 75)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (74, 'Issue 74: A Smashing Time for Arts & Activism', 'magazines/covers/issue-74.png', 'magazines/issue-74.pdf', 'Changing Ireland – Autumn 2021 – Issue 74:
SMASHING TIMES: MARY MOYNIHAN on 30 years of work & the upcoming Dublin Arts & Human Rights Festival.
MARCH: Protests mount over Jobs Club.
FOSTERING: Call for more Travellers to foster.
CHILDCARE: Strain over low pay.
FUNDING: Co-op gets value from LEADER.
TOWN WEBSITES: Humphreys urges others to follow Cootehill.
EQUITY: WHO’s DR MIKE RYAN & Minister of State JOE O’BRIEN.
10 TIPS: Using humour in youthwork.
YOUTHWORK: Humour is the missing ingredient, says FERGAL BARR.
DISABILITY SUPPORT: 5mins support daily “not nearly enough”, says SARAH FITZGERALD.
ACTIVISTS: End “incarceration” of disabled young people!
IRELAND’S FIRST WILDLIFE HOSPITAL: Volunteers needed.
5 REFUGEES: Stories of people who have settled here.
EU CLOTHING WASTE: Roscommon Women lead the way.
HORACE: Back at work & Marcus’s behaviour is of concern!', '2022-01', 74)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (73, 'Issue 73: Fresh hopes for isolated rural communities since you can now work remotely, even from Inishturk', 'magazines/covers/issue-73.png', 'magazines/issue-73.pdf', 'COVER: You can work remotely 14km offshore.
LEAD STORY: Islands and remote working – obstacles & opportunities / Inishturk – Families embrace remote working.
MONAGHAN: Ireland’s only community-owned hotel.
SHOW US THE MONEY: An Taoiseach asked about funding.
TAOISEACH’S SUPPORT: Top backing for community-led approach.
FRESH START: New Community Development Pilot Programme / 7 new pilot CDPs named after 124 apply.
FOSTERING: Tusla calls on new communities / Blessings on her experience fostering / 6 myth-busting facts on fostering.
GARRYOWEN: 50+ years wait for a community centre.
LEADER: Hedge Funds in Co. Dublin.
TENDERING: Communities may lose jobs clubs.
YOUTHWORK & HUMOUR: An essential ingredient.', '2021-08', 73)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (72, 'Issue 72: “Conas atá tú?” – the essence of Community Development', 'magazines/covers/issue-72.png', 'magazines/issue-72.pdf', 'COVER: “Conas atá tú?”
LEAD STORY: Community development explained – integration in Meath & Wexford.
EDITORIAL: Integration & equity: Conas atá tú?
MIKE RYAN: WHO says global vaccine inequality could define us.
ABUSE: Following FRC case, HSE’s Paul Reid condemns vaccine queue skipping as abuse of trust.
BEST ADVICE: The Wheel has weekly updates for community groups on vaccine rollout.
NATIONAL: Huge appetite for 8 Community Development Projects.
OUR RURAL FUTURE: 150 point plan to transform rural Ireland.
THREAT: Call to protect Local Employment Services.
NICOLA BROWNE: We need to put the ‘human’ back into human rights and social care organisations.
INTEGRATION & AN CÚPLA FOCAL: Angolan refugee & Sudanese doctor enjoy sean nós dance classes during lockdown.
WEXFORD: How community workers gained trust to work with people here seeking sanctuary.
Siobhán O’Brien: Real community work is about building trust, relations & community.
DUBLIN: Locals displaced by inner city’s gentrification.
NEWS: €70m in LEADER funding.
LEADER: Kerry village forges ahead.
HORACE’S DIARY: No masking the truth!', '2021-06', 72)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (71, 'Issue 71: We’ve got our sense of community back', 'magazines/covers/issue-71.png', 'magazines/issue-71.pdf', 'COVER: We’ve got our sense of community back.
LEAD STORY: Steo Wall interview.
EDITORIAL: Stronger communities may emerge.
ABUSED: 84% of young women said it had a “severe” impact on them.
NATIONAL: Development network’s plan launched.
BOFIN: Islanders film life on one of Ireland’s few Covid-free spots.
POLICY: National Volunteering Strategy launched.
GOV’T COVID FUND: Keeping groups such as Lucan’s going.
WAKE UP CALL: Instagram activism on the rise.
BETH ARDILL: Why Tasc’s report is good news for community development workers.
DAVIE PHILIP: ‘The Peoples Transition’ sings of bottom-up development.
AINE RYNNE: Biodiversity Leadership Training.
WILD CORK: Biodiversity is truly for everyone.
IN THE AIR: Community medics.
RURAL DEV’T: “It can happen anywhere” – Joe Kelly, Kiltimagh.
SERI: New association for Social Enterprises.
CO-OPS: Trees, Transition & Housing.
ROB CAREY: Of course the earth is flat!
LEADER: Musical inclusion in Louth.
LIBERTIES: Graham Mooney made history – we meet again.
CLOUGHJORDAN: Ecovillage clocks 20.', '2021-03', 71)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (70, 'Issue 70: Communities Serving The Country (Dec 2020)', 'magazines/covers/issue-70.png', 'magazines/issue-70.pdf', 'LEAD STORY: Focus on Offaly.
EDITORIAL: (Almost) Invisible People Doing Invaluable Work.
CORK: Mahon Community Workers Brought Fun to People’s Doors.
INNER CITY DUBLIN: Homeless people not well served by private hostels / Community Policing.
Q&A ON COMMUNITIES: Minister of State Joe O’Brien.
SLIGO/LEADER: ‘First of its kind’ community space opens.
STUDENT VIEWS: Full fees unfair.
FAMILY RESOURCE CENTRES: New report on impact.
LOCAL DEV’T COMPANIES: Connections made by trusted groups.
BOOK REVIEW: ‘Hitching for Hope’.
SICAP: How this programme is so remarkable – report.', '2020-12', 70)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (69, 'ISSUE 69: VOLUNTEERS IN TESTING TIMES / WHY PEOPLE BECOME ACTIVISTS (SUMMER 2020)', 'magazines/covers/issue-69.png', 'magazines/issue-69.pdf', 'COVER: Tallaght to West Clare.
LEAD STORIES: Volunteers in Testing Times / Why Peace-Loving People Become Activists.
EDITORIAL: Compassion is our new Currency.
DIRECT PROVISION: UN says NGOs should look again.
COPING DURING COVID: Laois & Offaly Case Studies.
COMMUNITY WORKERS: Ways to counter racism.
SENATOR FLYNN: Empowered by Community Development.
HOPE FOR LAOIS: Volunteers rapidly set up new project.
OUR LIBRARIES: They keep delivering.
AN COSÁN: Started with an online advantage.
FOOD DISTRIBUTION: Collaboration across country.
CHLOE CAREY: Anti-body-shaming video goes viral.
VOLUNTEER LOCKDOWN DIARIES: Now truly unique.
FOOD: Collaboration across country.
GAMBIA: Logical that community is favoured over individuals.
EDITOR’S FAMILY NEWSDESK
Contact Us
editor@changingireland.ie 061-326057 (reception) Moyross Community Hub Moyross Limerick V94 V0NP .tdi_58{vertical-align:baseline}.tdi_58>.wpb_wrapper,.tdi_58>.wpb_wrapper>.tdc-elements{display:block}.tdi_58>.wpb_wrapper>.tdc-elements{width:100%}.tdi_58>.wpb_wrapper>.vc_row_inner{width:auto}.tdi_58>.wpb_wrapper{width:auto;height:auto} .tdi_59{margin-bottom:15px!important;padding-bottom:5px!important;border-color:rgba(255,255,255,0.4)!important;border-style:solid!important;border-width:0px 0px 1px 0px!important}@media (min-width:768px) and (max-width:1018px){.tdi_59{width:90%!important}} .tdi_59{text-align:left!important}.tdi_59 .tdm-descr{color:var(--tt-extra-color);font-family:var(--tt-primary-font)!important;font-size:16px!important;line-height:1.6!important;font-weight:700!important;text-transform:uppercase!important}@media (min-width:768px) and (max-width:1018px){.tdi_59 .tdm-descr{font-size:13px!important}}@media (max-width:767px){.tdi_59 .tdm-descr{font-size:14px!important}} Where to find us
© Changing Ireland Community Media CLG, 2026. Privacy Policy - Website by Design My Website
We value your privacy
We use cookies to enhance your browsing experience, serve personalised ads or content, and analyse our traffic. By clicking "Accept All", you consent to our use of cookies.
We use cookies to help you navigate efficiently and perform certain functions. You will find detailed information about all cookies under each consent category below.
The cookies that are categorised as "Necessary" are stored on your browser as they are essential for enabling the basic functionalities of the site.
We also use third-party cookies that help us analyse how you use this website, store your preferences, and provide the content and advertisements that are relevant to you. These cookies will only be stored in your browser with your prior consent.
You can choose to enable or disable some or all of these cookies but disabling some of them may affect your browsing experience.
Necessary cookies are required to enable the basic features of this site, such as providing secure log-in or adjusting your consent preferences. These cookies do not store any personally identifiable data.
No cookies to display.
Functional cookies help perform certain functionalities like sharing the content of the website on social media platforms, collecting feedback, and other third-party features.
No cookies to display.
Analytical cookies are used to understand how visitors interact with the website. These cookies help provide information on metrics such as the number of visitors, bounce rate, traffic source, etc.
No cookies to display.
Performance cookies are used to understand and analyse the key performance indexes of the website which helps in delivering a better user experience for the visitors.
No cookies to display.
Advertisement cookies are used to provide visitors with customised advertisements based on the pages you visited previously and to analyse the effectiveness of the ad campaigns.
No cookies to display.', '2020-08', 69)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (68, 'Issue 68 – Summer 2020', 'magazines/covers/issue-68.png', 'magazines/issue-68.pdf', '', '2020-08', 68)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (67, 'Issue 67 – Winter 2019', 'magazines/covers/issue-67.png', 'magazines/issue-67.pdf', '', '2026-01', 67)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (66, 'Issue 66 – Autumn 2019', 'magazines/covers/issue-66.png', 'magazines/issue-66.pdf', '', '2026-01', 66)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (65, 'Issue 65 – Summer 2019', 'magazines/covers/issue-65.png', 'magazines/issue-65.pdf', '', '2019-09', 65)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (64, 'Issue 64 (2019)', 'magazines/covers/issue-64.png', 'magazines/issue-64.pdf', '', '2019-09', 64)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (63, 'Issue 63 (2019)', 'magazines/covers/issue-63.png', 'magazines/issue-63.pdf', '', '2019-09', 63)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (62, 'Issue 62 (2018)', 'magazines/covers/issue-62.png', 'magazines/issue-62.pdf', '', '2019-09', 62)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (61, 'Issue 61 (2018)', 'magazines/covers/issue-61.png', 'magazines/issue-61.pdf', '', '2019-09', 61)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (60, 'Issue 60 (2018)', 'magazines/covers/issue-60.png', 'magazines/issue-60.pdf', '', '2019-09', 60)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (59, 'Issue 59 (2018)', 'magazines/covers/issue-59.png', 'magazines/issue-59.pdf', '', '2019-09', 59)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (58, 'Issue 58 – Autumn 2017', 'magazines/covers/issue-58.png', 'magazines/issue-58.pdf', '', '2019-09', 58)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (57, 'Issue 57 – Spring 2017', 'magazines/covers/issue-57.png', 'magazines/issue-57.pdf', '', '2019-09', 57)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (56, 'Issue 56 – Winter 2016', 'magazines/covers/issue-56.png', 'magazines/issue-56.pdf', '', '2019-09', 56)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (55, 'Issue 55 – Autumn 2016', 'magazines/covers/issue-55.png', 'magazines/issue-55.pdf', '', '2019-09', 55)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (54, 'Issue 54 – Summer 2016', 'magazines/covers/issue-54.png', 'magazines/issue-54.pdf', '', '2019-09', 54)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (53, 'Issue 53 – Spring 2016', 'magazines/covers/issue-53.png', 'magazines/issue-53.pdf', '', '2019-09', 53)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (52, 'Issue 52 – Winter 2015', 'magazines/covers/issue-52.png', 'magazines/issue-52.pdf', '', '2019-09', 52)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (51, 'Issue 51 – Autumn 2015', 'magazines/covers/issue-51.png', 'magazines/issue-51.pdf', '', '2019-09', 51)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (50, 'Issue 50 – Summer 2015', 'magazines/covers/issue-50.png', 'magazines/issue-50.pdf', '', '2019-09', 50)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (49, 'Issue 49 – Spring 2015', 'magazines/covers/issue-49.png', 'magazines/issue-49.pdf', '', '2019-09', 49)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (48, 'Issue 48 – Winter 2014', 'magazines/covers/issue-48.png', 'magazines/issue-48.pdf', '', '2019-09', 48)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (47, 'Issue 47 – Autumn 2014', 'magazines/covers/issue-47.png', 'magazines/issue-47.pdf', '', '2019-09', 47)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (46, 'Issue 46 – Summer 2014', 'magazines/covers/issue-46.png', 'magazines/issue-46.pdf', '', '2019-09', 46)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (45, 'Issue 45 – Spring 2014', 'magazines/covers/issue-45.png', 'magazines/issue-45.pdf', '', '2019-09', 45)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (44, 'Issue 44 – Winter 2013', 'magazines/covers/issue-44.png', 'magazines/issue-44.pdf', '', '2019-09', 44)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (43, 'Issue 43', 'magazines/covers/issue-43.png', 'magazines/issue-43.pdf', '', '2019-09', 43)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (42, 'Issue 42 (2013)', 'magazines/covers/issue-42.png', 'magazines/issue-42.pdf', '', '2019-09', 42)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (41, 'Issue 41 – Winter 2012', 'magazines/covers/issue-41.png', 'magazines/issue-41.pdf', '', '2019-09', 41)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (40, 'Issue 40 – Autumn 2012', 'magazines/covers/issue-40.png', 'magazines/issue-40.pdf', '', '2019-09', 40)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (39, 'Issue 39 – Summer 2012', 'magazines/covers/issue-39.png', 'magazines/issue-39.pdf', '', '2019-09', 39)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (38, 'Issue 38 – Spring 2012', 'magazines/covers/issue-38.png', 'magazines/issue-38.pdf', '', '2019-09', 38)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (37, 'Issue 37 – Winter 2011', 'magazines/covers/issue-37.png', 'magazines/issue-37.pdf', '', '2019-09', 37)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (36, 'Issue 36 – Autumn 2011', 'magazines/covers/issue-36.png', 'magazines/issue-36.pdf', '', '2019-09', 36)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (35, 'Issue 35 – Spring 2011', 'magazines/covers/issue-35.png', 'magazines/issue-35.pdf', '', '2019-09', 35)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (34, 'Issue 34 – Winter 2010', 'magazines/covers/issue-34.png', 'magazines/issue-34.pdf', '', '2019-09', 34)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (33, 'Issue 33 – Summer 2010', 'magazines/covers/issue-33.png', 'magazines/issue-33.pdf', '', '2019-09', 33)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (32, 'Issue 32 – Spring 2010', 'magazines/covers/issue-32.png', 'magazines/issue-32.pdf', '', '2019-09', 32)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (30, 'Issue 30 – Winter 2009', 'magazines/covers/issue-30.png', 'magazines/issue-30.pdf', '', '2019-09', 30)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (29, 'Issue 29 – Summer 2009', 'magazines/covers/issue-29.png', 'magazines/issue-29.pdf', '', '2019-09', 29)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (28, 'Issue 28 – Spring 2009', 'magazines/covers/issue-28.png', 'magazines/issue-28.pdf', '', '2019-09', 28)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (27, 'Issue 27 – Autumn 2008', 'magazines/covers/issue-27.png', 'magazines/issue-27.pdf', '', '2019-09', 27)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (26, 'Issue 26 – Summer 2008', 'magazines/covers/issue-26.png', 'magazines/issue-26.pdf', '', '2019-09', 26)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (25, 'Issue 25 (2008)', 'magazines/covers/issue-25.png', 'magazines/issue-25.pdf', '', '2019-09', 25)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (24, 'Issue 24 – Spring 2008', 'magazines/covers/issue-24.png', 'magazines/issue-24.pdf', '', '2019-09', 24)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (23, 'Issue 23 – Winter 2007', 'magazines/covers/issue-23.png', 'magazines/issue-23.pdf', '', '2019-09', 23)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (22, 'Issue 22 – Summer 2007', 'magazines/covers/issue-22.png', 'magazines/issue-22.pdf', '', '2019-09', 22)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (21, 'Issue 21 – Spring 2007', 'magazines/covers/issue-21.png', 'magazines/issue-21.pdf', '', '2019-09', 21)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (20, 'Issue 20 – Winter 2006', 'magazines/covers/issue-20.png', 'magazines/issue-20.pdf', '', '2019-09', 20)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (19, 'Issue 19 (2006)', 'magazines/covers/issue-19.png', 'magazines/issue-19.pdf', '', '2011-06', 19)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (18, 'Issue 18 – Summer 2006', 'magazines/covers/issue-18.png', 'magazines/issue-18.pdf', '', '2019-09', 18)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (17, 'Issue 17 – Spring 2006', 'magazines/covers/issue-17.png', 'magazines/issue-17.pdf', '', '2019-09', 17)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (16, 'Issue 16 (2005)', 'magazines/covers/issue-16.png', 'magazines/issue-16.pdf', '', '2019-09', 16)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (15, 'Issue 15 – Autumn 2005', 'magazines/covers/issue-15.png', 'magazines/issue-15.pdf', '', '2019-09', 15)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (14, 'Issue 14 (2005)', 'magazines/covers/issue-14.png', 'magazines/issue-14.pdf', '', '2019-09', 14)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (13, 'Issue 13 – Winter 2004', 'magazines/covers/issue-13.png', 'magazines/issue-13.pdf', '', '2019-09', 13)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (12, 'Issue 12 – Autumn 2004', 'magazines/covers/issue-12.png', 'magazines/issue-12.pdf', '', '2019-09', 12)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (11, 'Issue 11 – Summer 2004', 'magazines/covers/issue-11.png', 'magazines/issue-11.pdf', '', '2019-09', 11)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (10, 'Issue 10 – Spring 2004', 'magazines/covers/issue-10.png', 'magazines/issue-10.pdf', '', '2019-09', 10)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (9, 'Issue 9 – Autumn 2003', 'magazines/covers/issue-9.png', 'magazines/issue-9.pdf', '', '2019-09', 9)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (8, 'Issue 8 – Summer 2003', 'magazines/covers/issue-8.png', 'magazines/issue-8.pdf', '', '2019-09', 8)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (7, 'Issue 7 (2003)', 'magazines/covers/issue-7.png', 'magazines/issue-7.pdf', '', '2019-09', 7)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (6, 'Issue 6 (2003)', 'magazines/covers/issue-6.png', 'magazines/issue-6.pdf', '', '2019-09', 6)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (5, 'Issue 5 – Autumn 2002', 'magazines/covers/issue-5.png', 'magazines/issue-5.pdf', '', '2019-09', 5)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (4, 'Issue 4 – Summer 2002', 'magazines/covers/issue-4.png', 'magazines/issue-4.pdf', '', '2019-09', 4)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (3, 'Issue 3 – Spring 2002', 'magazines/covers/issue-3.png', 'magazines/issue-3.pdf', '', '2019-09', 3)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (2, 'Issue 2 – Winter 2001', 'magazines/covers/issue-2.png', 'magazines/issue-2.pdf', '', '2020-11', 2)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;
INSERT INTO magazines (issue, title, cover_key, pdf_key, description, published_date, sort_order)
VALUES (1, 'Issue 1 – Summer 2001', 'magazines/covers/issue-1.png', 'magazines/issue-1.pdf', '', '2020-11', 1)
ON CONFLICT(issue) DO UPDATE SET
  title = excluded.title, pdf_key = excluded.pdf_key,
  cover_key = CASE WHEN excluded.cover_key != '' THEN excluded.cover_key ELSE magazines.cover_key END,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE magazines.description END,
  published_date = excluded.published_date, sort_order = excluded.sort_order;