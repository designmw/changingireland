INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('QUESTION! Is Community Development better understood in Ireland today compared to 10 years ago?', 'question-is-community-development-better-understood-in-ireland-today-compared-to-10-years-ago', '<p><span><b>INVITATION!</b></span></p>
<div><a href="https://3.bp.blogspot.com/-Mu1Eb90_DLk/TfAruObznVI/AAAAAAAAARU/DVGfvuxrSjA/s1600/Picture+7.png"><span><img loading="lazy" decoding="async" border="0" height="320" src="https://3.bp.blogspot.com/-Mu1Eb90_DLk/TfAruObznVI/AAAAAAAAARU/DVGfvuxrSjA/s320/Picture+7.png" width="214" /></span></a></div>
<p><span>Click on </span><span><a href="https://www.facebook.com/pages/Changing-Ireland/195484689356">this link and vote on our question</a>.&nbsp;</span><span>ANSWER by clicking on one of the options (or add your own option for people to vote for).</span></p>
<ul>
<li><span>No, because the term covers such a wide spectrum of activity</span></li>
<li><span>No, because Community Development work has declined because of Government cuts.</span></li>
<li><span>It&#8217;s complicated! It&#8217;s both up and down.</span></li>
<li><span>Yes, there is a better understanding of equality and collective action nowadays.</span></li>
</ul>', 'INVITATION! Click on this link and vote on our question. ANSWER by clicking on one of the options (or add your own option for people to vote for). No, because the term covers such a wide spectrum of activity No, because Community Development work has declined because of Government cuts. It’s complicated! It’s both up and', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 279, 1, '2011-06-09T01:11:00Z', '2019-09-13T10:52:24Z', '2011-06-09T01:11:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('Update in relation to former CDPs and the LCDP', 'update-in-relation-to-former-cdps-and-the-lcdp', '<p><strong>The Department’s statement reads:</strong></p>
<p>&#8220;The latest phase of cohesion involves the integration of Community Development Projects (CDPs) with the 52 LDCs and the establishment of the approved alternative structures. At one stage there was a total of 185 CDPs/groups being funded under the [LCDP] programme, however this is now 153.<a href="https://2.bp.blogspot.com/-r9f1rA3iEpA/TejNyoNQuDI/AAAAAAAAARQ/w0YqF84iOYI/s1600/LCDP+logo.jpg"><img loading="lazy" decoding="async" src="https://2.bp.blogspot.com/-r9f1rA3iEpA/TejNyoNQuDI/AAAAAAAAARQ/w0YqF84iOYI/s200/LCDP+logo.jpg" alt="" width="200" height="200" border="0" /></a> The position of these is as follows:</p>
<p>13 are classified as groups of national/special innovation are not part of the integration process</p>
<p>49 form part of six approved alternative integration models:</p>
<ul>
<li>3 Northside CDPs</li>
<li>17 Women’s CDPs</li>
<li>6 Limerick CDPs</li>
<li>14 Traveller CDPs</li>
<li>2 Bray CDPs</li>
<li>7 CDPs part of the HSE alternative model</li>
</ul>
<p>71 have concluded with or in the final stages of the integration process with their aligned LDC.</p>
<p>15 remain outside the integration process for the moment but it is hoped that arrangements for these will be concluded later this year.</p>
<p>5 are part of an alternative model for the “Islands – non Gaeltacht” which is currently under consideration within the Department.”</p>
<figure aria-describedby="caption-attachment-253123"><img loading="lazy" decoding="async" src="https://changingireland.ie/wp-content/uploads/2011/06/Map-showing-180-CDPs-in-2006.png" alt="" width="530" height="471" srcset="https://changingireland.ie/wp-content/uploads/2011/06/Map-showing-180-CDPs-in-2006.png 530w, https://changingireland.ie/wp-content/uploads/2011/06/Map-showing-180-CDPs-in-2006-300x267.png 300w" sizes="(max-width: 530px) 100vw, 530px" /><figcaption><em>&#8211; Map showing 180 CDPs in 2006. Source: Changing Ireland. Download as a high-res PDF with the full listing here: <a href="https://changingireland.ie/wp-content/uploads/2011/06/Iss-19-CDP-map-pages-180-projects-in-2006-high-res-NB.pdf">https://changingireland.ie/wp-content/uploads/2011/06/Iss-19-CDP-map-pages-180-projects-in-2006-high-res-NB.pdf</a><br /></em></figcaption></figure>
<p>&#8220;The Local and Community Development Programme (LCDP), which was launched on 1st January 2010, superseded the Local Development Social Inclusion and the Community Development Programmes. The aim of the LCDP is to tackle poverty and social exclusion through partnership and constructive engagement between Government and its agencies and people in disadvantaged communities.</p>
<p>&#8220;The Programme is underpinned by four high level goals:</p>
<ul>
<li>To promote awareness, knowledge and uptake of a wide range of statutory, voluntary and community services;</li>
<li>To increase access to formal and informal educational, recreational and cultural development activities and resources;</li>
<li>To increase peoples’ work readiness and employment prospects; and</li>
<li>To promote engagement with policy, practice and decision making processes on matters affecting local communities.</li>
</ul>
<p>&#8220;A key difference between the LCDP and its predecessor programmes is that, when it is fully implemented, it will be delivered through an integrated delivery structure in each of the 52 Local Development Company (LDC) areas. While a national model involving full integration was set out by the Department, it was made clear that other options could be considered once they met a range of criteria including:</p>
<ul>
<li>·      Reduced structures;</li>
<li>·      Better integrated delivery of services;</li>
<li>·      Supporting efficiencies; and</li>
<li>·      Reducing company law compliance requirements for projects.&#8221;</li>
</ul>', 'The Department of Environment, Community and Local Government this afternoon released figures to ‘Changing Ireland’ that show the number of projects funded under the Local and Community Development Programme.', 'https://changingireland.ie/wp-content/uploads/2011/06/Map-showing-180-CDPs-in-2006.png', '', '[{"slug":"community","title":"Community"},{"slug":"funding-programmes","title":"Funding Programmes"}]', '[]', '', 280, 1, '2011-06-02T16:10:00Z', '2023-06-02T20:00:16Z', '2011-06-02T16:10:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('COMMUNITY DEVELOPMENT MOST POPULAR IN GALWAY – Google “Fact”', 'community-development-most-popular-in-galway-google-fact', '<p><span><b></p>
<div>Is Community Development on the slippery slope in Ireland today?<o:p></o:p></div>
<div><span>It appears there is most interest in &#8220;community development&#8221; in Galway, with Cork and Limerick following next, followed oddly by the capital Dublin.</span><span><o:p></o:p></span></div>
<div><span>However, if &#8216;Google Analytics&#8217; is any kind of reliable guide (and we&#8217;re not saying it is) the relative slide in Irish interest in the concept of community development may be a cause for concern.<o:p></o:p></span></div>
<div><span><b><span>CLICK IMAGE TO ENLARGE</span></b></span></div>
<div><a href="https://2.bp.blogspot.com/-17EXs0veG6Q/Td0tHQUe65I/AAAAAAAAARE/Egoz1DEncQ8/s1600/Google+Analytics+-+Community+Development.png"><img loading="lazy" decoding="async" border="0" height="235" src="https://2.bp.blogspot.com/-17EXs0veG6Q/Td0tHQUe65I/AAAAAAAAARE/Egoz1DEncQ8/s400/Google+Analytics+-+Community+Development.png" width="400" /></a></div>
<div><span><span>According to</span><span><span> </span><a href="https://www.google.com/insights/search/#q=community%20development&amp;geo=IE&amp;cmpt=q"><span><span>Google&#8217;s chart here</span></span></a><span> </span></span><span>people are not looking it up online as much as before<a name=''more''></a> (as compared to people&#8217;s interest in other terms). Given how the statistics are devised, the interest level may actually have increased, but not relative to the interest-level in, let&#8217;s say the Heineken Cup or Jedward.</span></span></div>
<p><span></p>
<div><span><o:p></o:p></span></div>
<div><span>&#8216;Changing Ireland&#8217; also looked at the interest in googling for <a href="https://www.google.com/insights/search/#q=community%20development%2Ccommunity%20work&amp;geo=IE&amp;cmpt=q">&#8220;community development&#8221; compared with the term &#8220;community work&#8221;</a>. Here too, Galway people have the most interest. <o:p></o:p></span></div>
<div><span>Does this reflecting the fact that the likes of West Training, the National Traveller Women&#8217;s Forum and&nbsp;the Community Workers&#8217; Co-op&nbsp;are based in Galway? Or is it because Galway people generally always have more interest in community?</span><o:p></o:p></div>
<div>Do you believe the statistics?</div>
<p></span> <span></p>
<div>
<div><span><b><span>CLICK IMAGE TO ENLARGE</span></b></span></div>
<div><a href="https://4.bp.blogspot.com/-DGgnolzfxfw/Td5Z_8P_hRI/AAAAAAAAARM/x81MP4XYAr4/s1600/Google+Analytics+-+Comm+Devt+V+Comm+Work.png"><img loading="lazy" decoding="async" border="0" height="226" src="https://4.bp.blogspot.com/-DGgnolzfxfw/Td5Z_8P_hRI/AAAAAAAAARM/x81MP4XYAr4/s400/Google+Analytics+-+Comm+Devt+V+Comm+Work.png" width="400" /></a></div>
<div><span><span><b></p>
<div><span><span><span>On a very positive note, the word &#8220;community&#8221; is now</span></span><a href="https://www.google.com/trends?q=community&amp;ctab=0&amp;geo=ie&amp;geor=all&amp;date=all"><span> popping up increasingly</span></a> <span><span>in news reports. The terms appears twice as much in Irish news reports online in 2011 than it did seven years ago.</span></span></span></div>
<p></b></span></span></div>
</div>
<p></span></b></span></p>', 'Is Community Development on the slippery slope in Ireland today? It appears there is most interest in “community development” in Galway, with Cork and Limerick following next, followed oddly by the capital Dublin. However, if ‘Google Analytics’ is any kind of reliable guide (and we’re not saying it is) the relative slide in Irish interest', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 281, 1, '2011-05-25T15:07:00Z', '2019-09-13T10:53:06Z', '2011-05-25T15:07:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('OBAMA, TRAVELLERS & ‘CHANGING IRELAND’', 'obama-travellers-changing-ireland', '<p><span><span>US President Barack Obama started out as a community worker and he&#8217;s here in Ireland today! His people hailed from Offaly.</span></span><br /><span><span>Many see him as a true hero and an inspiration to members of minorities everywhere, others see him as a puppet of the military-industrial complex and Wall Street. The truth includes elements of both perspectives and some more.</span></span><br /><span><span>However, it is due to his background as a community worker that we decided to feature him in Spring 2009 on our front cover after he was elected US President.</span></span></p>
<div><a href="https://3.bp.blogspot.com/-yCfkDrVs_Uo/TdqHE-RUPWI/AAAAAAAAAQ4/ztyz7jWUNGc/s1600/Picture+12.png"><span><img loading="lazy" decoding="async" border="0" height="320" src="https://3.bp.blogspot.com/-yCfkDrVs_Uo/TdqHE-RUPWI/AAAAAAAAAQ4/ztyz7jWUNGc/s320/Picture+12.png" width="224" /></span></a></div>
<p><span><span><br /></span> </span><br /><span><span>Obama is known to have an interest (to quote Jesse Jackson among others who know him well) in the issue of Traveller rights in Ireland and it was in connection with a Traveller story that we published his photo.</span></span><br /><span><span>For the record, </span><a href="https://changingireland.ie/Issue28.pdf"><span>click here for a link to the full PDF edition of the Obama edition.</span></a></span><br /><span><span><br /></span></span></p>', 'US President Barack Obama started out as a community worker and he’s here in Ireland today! His people hailed from Offaly.Many see him as a true hero and an inspiration to members of minorities everywhere, others see him as a puppet of the military-industrial complex and Wall Street. The truth includes elements of both perspectives', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 282, 1, '2011-05-23T16:12:00Z', '2011-05-23T16:12:00Z', '2011-05-23T16:12:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('Supporting local businesses – A RURAL DEVELOPMENT PROGRAMME TASTER!', 'supporting-local-businesses-a-rural-development-programme-taster', '<p><span>The Local and Community Development Programme is one of around a dozen programmes administered by Local Development Companies (aka Partnerships) around the country.</span><br /><span>One of the better-known programmes is LEADER (or to use call it by its proper title, the Rural Development Programme).&nbsp;</span><br /><span>Here&#8217;s just one example, from Kerry, of how the North East Kerry Development used funding from the Rural Development Programme to make a real difference for a small business in Ballybunion that employs eight seasonal staff.</span></p>
<div><object class codebase="https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" height="266" width="320"><param name="movie" value="https://www.youtube.com/v/1KUmhOcgNBE?f=user_uploads&#038;c=google-webdrive-0&#038;app=youtube_gdata" /><param name="bgcolor" value="#FFFFFF" /><embed width="320" height="266" src="https://www.youtube.com/v/1KUmhOcgNBE?f=user_uploads&#038;c=google-webdrive-0&#038;app=youtube_gdata" type="application/x-shockwave-flash"></embed></object></div>
<p><span><span><span><b><span>NOTE</span></b><span>: The upcoming edition of &#8216;Changing Ireland&#8217; out this June will include a 2-page feature on the RDP. As well as supporting small local businesses, the RDP also funds projects that engage in community development, tourism interests and heritage work.</span></span> </span></span></p>', 'The Local and Community Development Programme is one of around a dozen programmes administered by Local Development Companies (aka Partnerships) around the country.One of the better-known programmes is LEADER (or to use call it by its proper title, the Rural Development Programme). Here’s just one example, from Kerry, of how the North East Kerry Development used', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 283, 1, '2011-05-20T16:25:00Z', '2011-05-20T16:25:00Z', '2011-05-20T16:25:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('ONE OF OUR BEST FILMS YET: Claiming Our Future UPDATE!', 'one-of-our-best-films-yet-claiming-our-future-update', '<div><span>&#8216;Changing Ireland&#8217; has produced a 5 minute film from the CLAIMING OUR FUTURE day in Nenagh, Co. Tipperary when nearly 40 people worked on ideas to make local authorities more inclusive of the demands of citizens. One councillor described the present set-up as &#8220;absolute bull.&#8221; One of our best videos yet!</span></div>
<div><span>North Tipperary Leader Partnership supported the event in Nenagh under Goal 4 of the Local and Community Development Programme which aims to get people from local communities involved in decision-making that effects their lives.</span></div>
<div><object class codebase="https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" height="266" width="320"><param name="movie" value="https://www.youtube.com/v/VqYL_YuXE5I?f=user_uploads&#038;c=google-webdrive-0&#038;app=youtube_gdata" /><param name="bgcolor" value="#FFFFFF" /><embed width="320" height="266" src="https://www.youtube.com/v/VqYL_YuXE5I?f=user_uploads&#038;c=google-webdrive-0&#038;app=youtube_gdata" type="application/x-shockwave-flash"></embed></object></div>
<div><span><span><span>For more info/background, see our earlier</span> <a href="https://changingireland.blogspot.com/2011/05/live-blogging-from-citizens-forum-in.html">blog posting live from the event</a> <span>and</span> <a href="https://changingireland.blogspot.com/2011/05/seeking-more-citizen-involvement-in.html">prior to the day.</a>&nbsp;<span>You can read th</span>e <a href="https://www.tipperarystar.ie/news/local/nenagh_citizens_forum_is_told_that_the_republic_has_failed_dismally_1_2689419">Tipperary Star&#8217;s report here.</a></span></span></div>', '‘Changing Ireland’ has produced a 5 minute film from the CLAIMING OUR FUTURE day in Nenagh, Co. Tipperary when nearly 40 people worked on ideas to make local authorities more inclusive of the demands of citizens. One councillor described the present set-up as “absolute bull.” One of our best videos yet! North Tipperary Leader Partnership', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 284, 1, '2011-05-20T16:09:00Z', '2011-05-20T16:09:00Z', '2011-05-20T16:09:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('YOUTH TRAINING IN CO. TIPPERARY – 1ST IN EUROPE (possibly)', 'youth-training-in-co-tipperary-1st-in-europe-possibly', '<div><object class codebase="https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" height="266" width="320"><param name="movie" value="https://www.youtube.com/v/VFbEhrb-YCc?f=user_uploads&#038;c=google-webdrive-0&#038;app=youtube_gdata" /><param name="bgcolor" value="#FFFFFF" /><embed width="320" height="266" src="https://www.youtube.com/v/VFbEhrb-YCc?f=user_uploads&#038;c=google-webdrive-0&#038;app=youtube_gdata" type="application/x-shockwave-flash"></embed></object></div>
<p><span>This project, which targets young men and early-school leavers, is supported by the North Tipperary Leader Partnership which is part of Ireland&#8217;s national Local and Community Development Programme.</span></p>', 'This project, which targets young men and early-school leavers, is supported by the North Tipperary Leader Partnership which is part of Ireland’s national Local and Community Development Programme.', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 286, 1, '2011-05-20T14:59:00Z', '2019-09-13T10:53:13Z', '2011-05-20T14:59:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('LIVE-BLOGGING FROM CITIZENS’ FORUM IN NENAGH', 'live-blogging-from-citizens-forum-in-nenagh', '<div><span><span><b>   </p>
<div>LATEST ALERT&#8230; EVENT ON FILM &#8211; <a href="https://www.youtube.com/watch?v=VqYL_YuXE5I&amp;feature=player_embedded">HOW TO SET UP A CITIZENS&#8217; FORUM (CLICK HERE)</a><o:p></o:p></div>
<p></b></span></span></div>
<div><span><span><span><a href="https://www.youtube.com/watch?v=VqYL_YuXE5I&amp;feature=player_embedded"></a></span></span>Live-blogging from the Civic Centre in Nenagh, Co. Tipperary today&#8230; It&#8217;s the venue for a Citizens&#8217; Forum for making local Government better. Sounds like another talking shop &#8211; not so.<a name=''more''></a> The folks who came along today &#8211; around 40 of them &#8211; are right now discussing their ideas which will in the coming days be presented to Nenagh Town Council and North Tipperary County Council for action.</span></div>
<p><span>Ideas discussed earlier included an idea from Brazil called &#8216;Participatory Budgeting&#8217; where the citizens have a real say in how their taxes are spent locally. Another suggestion was for Citizens&#8217; Juries, as already piloted in Ballymun, Dublin.</span><br /><span>We&#8217;ll keep you posted on what Nenagh proposes &#8211; after the results of the discussions come in.</span></p>
<div><span><img loading="lazy" decoding="async" border="0" height="298" src="https://3.bp.blogspot.com/-5rVP6UpYkxw/Tc6mPK6EkSI/AAAAAAAAAQ0/C_wYVm3b40A/s400/CITIZENS%2527+FORUM+talking+about+real+local+action.JPG" width="400" /></span></div>
<p><span><span></span></span><br /><span>The photo shows the discussion in progress.</span></p>', 'LATEST ALERT… EVENT ON FILM – HOW TO SET UP A CITIZENS’ FORUM (CLICK HERE) Live-blogging from the Civic Centre in Nenagh, Co. Tipperary today… It’s the venue for a Citizens’ Forum for making local Government better. Sounds like another talking shop – not so. The folks who came along today – around 40 of', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 288, 1, '2011-05-14T18:00:00Z', '2019-09-13T10:53:19Z', '2011-05-14T18:00:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('Activists learning from old hands, through Spunout', 'activists-learning-from-old-hands-through-spunout', '<p>Activists in Ireland are now learning from old hands, through Spunout.<br />
The youth organisation is organising its 2nd &#8216;Academy for Activists&#8217; which will be held in June. You can read <a href="https://docs.google.com/viewer?a=v&amp;pid=explorer&amp;chrome=true&amp;srcid=0B8_sTzXXXVDUNGFlYzljOTQtZTk4Ny00YmZhLTg1MTQtN2QwNTkxZGMxYTk4&amp;hl=en">full details in their press release here</a>.<br />
Among those leading the learning will be Sarah Clancy (pictured).</p>
<div><a href="https://1.bp.blogspot.com/-YbcNxjch8Z0/TcqseB-4QiI/AAAAAAAAAQs/tGleCzlhmU0/s1600/SPUNOUT%2527S%2BSARAH%2BCLANCY.JPG"><img loading="lazy" decoding="async" src="https://1.bp.blogspot.com/-YbcNxjch8Z0/TcqseB-4QiI/AAAAAAAAAQs/tGleCzlhmU0/s400/SPUNOUT%2527S%2BSARAH%2BCLANCY.JPG" width="400" height="300" border="0" /></a></div>', 'Activists in Ireland are now learning from old hands, through Spunout. The youth organisation is organising its 2nd ‘Academy for Activists’ which will be held in June. You can read full details in their press release here. Among those leading the learning will be Sarah Clancy (pictured).', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 289, 1, '2011-05-11T14:31:00Z', '2019-09-13T10:53:26Z', '2011-05-11T14:31:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('Dóchas – EU’s extreme poverty work is crucial', 'dochas-eus-extreme-poverty-work-is-crucial', '<p></p>
<p><span><b><span>BY BRENDAN MEEHAN</span></b></span></p>
<div><span lang="EN-GB"><span>The coming months will be pivotal in terms of global poverty and how Europe collectively handles the problem, says Dóchas, the umbrella organisation for Irish NGOs.</span></span></div>
<div></div>
<div><span lang="EN-GB"><span>It stressed the point at its 18th AGM held in Dublin City Council&#8217;s Civic Offices on May 5 and if you want a quick (2 min) and light-hearted insight into the issues, check out this video:</span></span></div>
<div><object codebase="https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" height="266" width="320"><param name="movie" value="https://www.youtube.com/v/L5aWPC4MzV0&amp;fs=1&amp;source=uds" /><param name="bgcolor" value="#FFFFFF" /><embed width="320" height="266" src="https://www.youtube.com/v/L5aWPC4MzV0&amp;fs=1&amp;source=uds" type="application/x-shockwave-flash" /></object></div>
<div><span><br /> </span></div>
<div><span lang="EN-GB"><span>The “Guaranteed Irish?” conferance focused heavily on Irish leadership in International development cooperation.<a name="more"></a> The end result was that the member agencies of Dóchas reaffirmed their commitment to professional standards for overseas aid, and highlighted the benefits of continued investment in international development cooperation.</span></span></div>
<div></div>
<blockquote>
<div><span lang="EN-GB"><span>“If we are serious about ending extreme poverty, we must get European countries to work together and the decisions to be taken in the next few months will determine whether Europe is ready and able to take on that task,” Hans Zomer, director of Dóchas told the press.</span></span></div>
</blockquote>
<div><span lang="EN-GB"><span>Dóchas capitalised on yesterday’s Europe day festivities to urge the EU to act decisively to combat extreme poverty.</span></span></div>
<div><span lang="EN-GB"><span>“The EU’s budget for foreign policy and the fight against extreme poverty is likely to come under pressure as negotiations start in earnest this summer,” said Mr Zomer. </span></span></div>
<div></div>
<div><span lang="EN-GB"><span>Jan O’Sullivan, Minister of State for the Department of Foreign Affairs was among the speakers, and she discussed in detail the evolving relationship between Irish Aid and Civil Society Organisations (CSOs).</span></span></div>
<div></div>
<div><span lang="EN-GB"><span>“I know that CSOs at an international level have drawn up a set of principles on development effectiveness and that Irish NGOs fully endorse these principles.”</span></span></div>
<div><span lang="EN-GB"><span>“As Minister of State for Trade and Development, it is part of my job to defend our aid programme. The Irish public has always been a strong supporter of our work.”</span></span></div>
<div></div>
<div><span lang="EN-GB"><span>The T.D was quick to acknowledge the changing economic landscape: “However, times have changed and at the household level in Ireland people are examining every area of expenditure.  As we all know, government is also making very difficult expenditure choices.” </span></span></div>
<div></div>
<div><span lang="EN-GB"><span><b><span>More information on the conference is <a href="https://www.dochas.ie/Pages/Resources/Viewer.aspx?id=703">available here</a> and <a href="https://www.dochas.ie/Shared/Files/1/Irish_development_NGOs_AGM.pdf">also here.</a></span></b></span></span></div>
<p></p>', 'BY BRENDAN MEEHAN The coming months will be pivotal in terms of global poverty and how Europe collectively handles the problem, says Dóchas, the umbrella organisation for Irish', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 290, 1, '2011-05-10T16:01:00Z', '2019-08-23T14:37:38Z', '2011-05-10T16:01:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('KIRBY & HARRIS TO STIR THE CITIZENRY IN PREMIER COUNTY', 'kirby-harris-to-stir-the-citizenry-in-premier-county', '<div><span>Peadar Kirby and Clodagh Harris &#8211; two experts on democracy from Limerick and Cork respectively &#8211; will be the guest speakers at a Citizens&#8217; Forum in Nenagh on Saturday, May 14th.</span></div>
<div><span></span><span><a href="https://www.ntlp.ie/">North Tipperary Leader Partnership</a> is supporting the initiative which is one of a number of such events taking place around the country under the <a href="https://www.claimingourfuture.ie/">&#8216;Claiming Our Future</a>&#8216; banner.</span></div>
<div><span>. </span><span><span>&nbsp;</span></span><a href="https://4.bp.blogspot.com/-yQMjk1ZL5HE/TckiHm_qLTI/AAAAAAAAAQk/KO20Qw2mRug/s1600/Picture+1.png"><span><img loading="lazy" decoding="async" border="0" height="320" src="https://4.bp.blogspot.com/-yQMjk1ZL5HE/TckiHm_qLTI/AAAAAAAAAQk/KO20Qw2mRug/s320/Picture+1.png" width="227" /></span></a></div>
<div><span></span></div>
<p><span></span><br /><span></span><br /><span></span><br /><span></p>
<div>The forum which is being held in&nbsp;Nenagh Arts Centre from 1.45pm &#8211; 5pm.<o:p></o:p></div>
<div><a name=''more''></a></div>
<p></span></p>
<div><span>The main part of the event, the&nbsp;Citizens’ Forum (3-4.20pm), will see participants discuss and make proposals for greater citizen participation in local government.<o:p></o:p></span></div>
<div><span>The afternoon will open with&nbsp;brief talks by experts on Citizen Democracy<o:p></o:p></span></div>
<div><span>(2-3pm):<o:p></o:p></span></div>
<div><span><i>&#8211; Dr. Clodagh Harris will talk about “International examples of Citizen Participation in Local Government”.<o:p></o:p></i></span></div>
<div><span><i>&#8211; Dr. Peadar Kirby will present “Towards the 2nd Republic &#8211; Politics after the Celtic Tiger”.<o:p></o:p></i></span></div>
<div><span><i>Other speakers include Phyl Bugler (FG) and Viriginia O’Dowd (Labour).<o:p></o:p></i></span></div>
<div><span>The Mayor of Nenagh, Seamus Morris, will open the event at 2pm.<o:p></o:p></span></div>
<div><span><br /></span></div>
<p><span></span></p>
<div><span><span><a href="https://4.bp.blogspot.com/-yQMjk1ZL5HE/TckiHm_qLTI/AAAAAAAAAQk/KO20Qw2mRug/s1600/Picture+1.png"></a>This work to promote citiz</span></span><span>ens&#8217; involvement comes under Goal 4 of the Local and Community Development Programme whereby Local Development Companies are tasked with getting people from local communities involved in decision-making, in formulating policy and in pushing for the best that their communities deserve.&nbsp;</span></div>
<div><span>Nenagh welcomes all and registration takes place at 1.45pm on the day.</span></div>
<p><span></span><br /><span></p>
<div><o:p></o:p></div>
<div>Book via Gerry on&nbsp;087-2197813 or email:&nbsp;<span><a href="mailto:tipperarynorth@claimingourfuture.ie" target="_blank" title="mailto:tipperarynorth@claimingourfuture.ie" rel="noopener noreferrer">tipperarynorth@claimingourfuture.ie</a></span></p>
<p><b><span><span>BLOG UPDATE FROM NENAGH AT: https://changingireland.blogspot.com/2011/05/live-blogging-from-citizens-forum-in.html</span></span></b></div>
<div></div>
<div><span>Meanwhile the 2nd <b>national</b> Claiming Our Future event is on in Galway on Saturday, May 28th, it&#8217;s free and <a href="https://www.cwc.ie/2011/03/claiming-our-future/">if you want more info or to book your place, click here now.</a></span></div>
<p></span></p>', 'Peadar Kirby and Clodagh Harris – two experts on democracy from Limerick and Cork respectively – will be the guest speakers at a Citizens’ Forum in Nenagh on Saturday, May 14th. North Tipperary Leader Partnership is supporting the initiative which is one of a number of such events taking place around the country under the', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 291, 1, '2011-05-10T10:35:00Z', '2019-09-13T10:53:33Z', '2011-05-10T10:35:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('Man in court in Killarney over “actions likely to stir up hatred”', 'man-in-court-in-killarney-over-actions-likely-to-stir-up-hatred', '<div><a href="https://1.bp.blogspot.com/-6nzs8aC2vzs/Ta3_VzuJWRI/AAAAAAAAAQI/Zi-yLtHmRCE/s1600/Killarney+District+Court.JPG"><span><img loading="lazy" decoding="async" border="0" height="149" src="https://1.bp.blogspot.com/-6nzs8aC2vzs/Ta3_VzuJWRI/AAAAAAAAAQI/Zi-yLtHmRCE/s200/Killarney+District+Court.JPG" width="200" /></span></a></div>
<p><span>A 27-year-old man was before Killarney District Court today charged with &#8220;actions likely to stir up hatred.&#8221;<br />Patrick Kissane from Knockasarnett, Killarney, Co. Kerry appeared before Judge James O&#8217;Connor.<br />Solicitor for the defendant, Pat F. O&#8217;Connor sought to have the case heard at a later date and Inspector Martin McCarthy, prosecuting, agreed saying, &#8220;This is a rather unusual charge and we&#8217;d like to get the DPP&#8217;s views on the whole thing.&#8221;<br />The case was adjourned&nbsp;</span>   <a href="x-apple-data-detectors://1" x-apple-data-detectors="true"><span>until July 19th</span></a><span>, to be heard in front of the same court.<br />The defendant was charged in connection with offences dated&nbsp;</span> <a href="x-apple-data-detectors://2" x-apple-data-detectors="true"><span>October 1st</span></a><span>&nbsp;of last year.<br />The Irish Traveller Movement&#8217;s assistant director Brigid Quilligan and Mary Boyne from Kerry Travellers Development Group attended the court today &#8220;to observe and to monitor proceedings.&#8221;</span> <span><br /></span></p>', 'A 27-year-old man was before Killarney District Court today charged with “actions likely to stir up hatred.”Patrick Kissane from Knockasarnett, Killarney, Co. Kerry appeared before Judge James O’Connor.Solicitor for the defendant, Pat F. O’Connor sought to have the case heard at a later date and Inspector Martin McCarthy, prosecuting, agreed saying, “This is a rather', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 293, 1, '2011-04-19T13:49:00Z', '2019-09-13T10:53:39Z', '2011-04-19T13:49:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('MAN DUE IN COURT OVER ANTI-TRAVELLER FACEBOOK SITE', 'man-due-in-court-over-anti-traveller-facebook-site', '<div><a href="https://1.bp.blogspot.com/-QWZ5K3Jy58o/TayVGyHnQdI/AAAAAAAAAQA/xJsDpcIJf1I/s1600/Garda-logo-4.jpg"><span><img loading="lazy" decoding="async" border="0" height="192" src="https://1.bp.blogspot.com/-QWZ5K3Jy58o/TayVGyHnQdI/AAAAAAAAAQA/xJsDpcIJf1I/s200/Garda-logo-4.jpg" width="200" /></span></a></div>
<div><span>A man is to appear before Killarney District Court tomorrow in connection with an anti-Traveller Facebook site called ‘Promote The Use Of Knacker Babies As Bait’.</span></div>
<div><span lang="EN-GB"><span>A barman at the time of the alleged offence, he was charged at Killarney Garda Station a fortnight ago in relation to his involvement in creating the site.</span></span></div>
<div><span lang="EN-GB"><span>The man is being brought before the courts under Section 2 of the Incitement of Hatred Act 1989 which, among other things, prohibits the publishing of racist material.<a name=''more''></a></span></span></div>
<div><span lang="EN-GB"><span>The offensive site had built up a following of 664 fans before Facebook removed it last summer after complaints by community workers nationwide.</span></span></div>
<div><span lang="EN-GB"><span>Official complaints were also lodged with the Gardai by members of Pavee Point, Kerry Travellers Development Group and Waterford Travellers Community Development Project.</span></span></div>
<div><span lang="EN-GB"><span>Sergeant Dave McInerney of the Garda Racial, Intercultural and Diversity Office confirmed that the case was unusual: “It’s the first time someone had been charged under the Incitement to Hatred Act for online publishing.”</span></span></div>
<div><span lang="EN-GB"><span><br /></span></span></div>
<div><span lang="EN-GB"><span>FURTHER INFORMATION:</span></span></div>
<div><span lang="EN-GB"><span>(1) </span></span></div>
<div><span lang="EN-GB"><span>Section 2 of the Incitement of Hatred Act 1989 makes it an offence to “</span></span><span>publish or distribute written material” or “to distribute, show or play a recording of visual images or sounds” that are “threatening, abusive or insulting and are intended or, having regard to all the circumstances, are likely to stir up hatred.”<o:p></o:p></span></div>
<div><span>(2) <o:p></o:p></span></div>
<div><span lang="EN-GB"><span>The offensive site referred to in the story was one of three hate sites set up last year targeting Travellers. All have since been removed.&nbsp;</span></span></div>', 'A man is to appear before Killarney District Court tomorrow in connection with an anti-Traveller Facebook site called ‘Promote The Use Of Knacker Babies As Bait’. A barman at the time of the alleged offence, he was charged at Killarney Garda Station a fortnight ago in relation to his involvement in creating the site. The', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 294, 1, '2011-04-18T18:47:00Z', '2019-09-13T10:53:51Z', '2011-04-18T18:47:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('North East Kerry Development – report launch', 'north-east-kerry-development-report-launch', '<div><a href="https://4.bp.blogspot.com/-d5P7fj7qX7Y/Taw3uqujalI/AAAAAAAAAP4/AcHJ89FP5Mo/s1600/photo-789232.JPG"><span><img decoding="async" alt="" border="0" src="https://4.bp.blogspot.com/-d5P7fj7qX7Y/Taw3uqujalI/AAAAAAAAAP4/AcHJ89FP5Mo/s320/photo-789232.JPG" /></span></a></div>
<p><span>North East Kerry Development&#8217;s Progress Report covering 2009-2010 was launched today in Listowel. </span><br /><span>Speakers included a community representative and a businesswoman who relayed how they had benefitted from the local development company&#8217;s support.</span><br /><span>Minister for Arts, Heritage and Gaeltacht Affairs, Jimmy Deenihan, officially launched the report.</span></p>
<div><a href="https://1.bp.blogspot.com/-5CoC4foMTI8/TazL7WMf5iI/AAAAAAAAAQE/IbuI_qeYhxU/s1600/DSCF8795.JPG"><img loading="lazy" decoding="async" border="0" height="300" src="https://1.bp.blogspot.com/-5CoC4foMTI8/TazL7WMf5iI/AAAAAAAAAQE/IbuI_qeYhxU/s400/DSCF8795.JPG" width="400" /></a></div>
<p><span><i>PHOTOS BY CHANGING IRELAND, FEATURING IN BOTH SHOTS: Eamon O&#8217;Reilly, NEKD chief, Pat Mitchell, chairman and Minister Jimmy Deenihan.</i></span><span><br /></span></p>', 'North East Kerry Development’s Progress Report covering 2009-2010 was launched today in Listowel. Speakers included a community representative and a businesswoman who relayed how they had benefitted from the local development company’s support.Minister for Arts, Heritage and Gaeltacht Affairs, Jimmy Deenihan, officially launched the report. PHOTOS BY CHANGING IRELAND, FEATURING IN BOTH SHOTS: Eamon O’Reilly,', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 295, 1, '2011-04-18T13:05:00Z', '2011-04-18T13:05:00Z', '2011-04-18T13:05:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('Rousing welcomes for Mary Robinson and Rita Fagan at Possibilities Conference', 'rousing-welcomes-for-mary-robinson-and-rita-fagan-at-possibilities-conference', '<div>
<div></div>
<p>&nbsp;</p>
<div>This &#8216;Possibilities&#8217; conference is one with a difference, featuring threatre, music, song and dance, not to mention famous activists and promoters of peace and human rights.</div>
<div>Following Kila&#8217;s performance, Mary Robinson received a rousing welcome when she spoke this afternoon, focusing in on a few lines in the UN Declaration of Human Rights and our duty to community.</div>
<div>She phrased it better than the original which states: &#8220;<i>Article 29 &#8211; </i>Everyone has duties to the community in which alone the free and full development of his personality is possible.&#8221;</div>
<div></div>
<div>She spoke about the need for &#8220;a greater sense of shared responsibility for the implementation of international human rights law.&#8221;</div>
<div>She was followed by five speakers from communities in Ireland including Mayo&#8217;s John Monaghan and Dublin&#8217;s Rita Fagan, the former unpaid, the latter unpaid, both working in communities.</div>
<div></div>
<div><b>&#8211; 2 VIDEOS UPLOADED (ALMOST LIVE)!</b></div>
<div></div>
<div>2 videos we&#8217;ve uploaded from this afternoon &#8211; one featuring<a href="https://www.youtube.com/watch?v=RHwYGGItxAA"><span> the Dalai Lama answering a question about youth in Ireland</span></a> and the second featuring <a href="https://www.youtube.com/user/changingireland#p/u/0/5LV9hazwCBQ"><span>Rita Fagan telling her story of community struggle, after which she sings</span></a>! And for the record, Rita’s a good singer.</div>
<p>&nbsp;</p>
</div>
<div>
<div>
<div><span><span><br />
</span> </span></div>
</div>
</div>
<div>
<div>
<div><b><span><span> </span></span></b></div>
<div><b><span><span> </span></span></b></div>
</div>
</div>
<div>
<div><a href="https://3.bp.blogspot.com/-4I3Tj_zNZmo/TaW38wbLD0I/AAAAAAAAAP0/i9IFI0Sx3DI/s1600/Picture+17.png"><span><span><img loading="lazy" decoding="async" src="https://3.bp.blogspot.com/-4I3Tj_zNZmo/TaW38wbLD0I/AAAAAAAAAP0/i9IFI0Sx3DI/s320/Picture+17.png" width="320" height="229" border="0" /></span></span></a></div>
<div>
<div><span><span>PHOTO: Community worker Rita Fagan.</span></span></div>
</div>
</div>', 'This ‘Possibilities’ conference is one with a difference, featuring threatre, music, song and dance, not to mention famous activists and promoters of peace and human rights. Following Kila’s performance, Mary Robinson received a rousing welcome when she spoke this afternoon, focusing in on a few lines in the UN Declaration of Human Rights and', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 296, 1, '2011-04-13T14:49:00Z', '2019-07-09T15:58:20Z', '2011-04-13T14:49:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('Richard Moore – blind man with a vision', 'richard-moore-blind-man-with-a-vision', '<div><a href="https://3.bp.blogspot.com/-gtqjeqIGkRQ/TaWFsmmRuXI/AAAAAAAAAPs/zLzjZWnKbUA/s1600/photo-798186.JPG"><img decoding="async" src="https://3.bp.blogspot.com/-gtqjeqIGkRQ/TaWFsmmRuXI/AAAAAAAAAPs/zLzjZWnKbUA/s320/photo-798186.JPG" alt="" border="0" /></a></div>
<p>LIVE REPORT &#8211; CHILDREN IN CROSSFIRE DIRECTOR, THE MAN WHO BROUGHT THE DALAI LAMA TO IRELAND<br />
Richard Moore from Children In Crossfire introduced the 14th Dalai Lama in Dublin this morning.<br />
Richard set up the NGO some years after losing his eyesight as a child to a British bullet in Derry in the 1970s.<br />
Richard  said the Dalai Lama always teases him about how beautiful his wife is.<br />
<a name="more"></a> Richard and the Dalai Lama have become solid friends, with the Dalai Lama publicly naming him a &#8220;hero&#8221; and asking people to imagine what it would be like aged ten to find you&#8217;ll never see your mother&#8217;s face again.<br />
&#8220;I don&#8217;t cope with being blind, I (now) enjoy being blind,&#8221; said Richard.<br />
Today&#8217;s event is being held to inspire people to realise they have a duty to seek change.<br />
He gave one simple but glowing example from his own life:<br />
&#8220;A woman called Teresa Matterson from Co. Down read about what happened me  in the newspaper and wrote letters to my mother for many years after.&#8221;<br />
&#8220;My mother has never met her, but she kept all the letters and last year I met her for the first time.&#8221;<br />
&#8220;Well, there&#8217;s one simple action by a woman in a small town in Northern Ireland  that she took when she was moved (by the story and how his mother must feel). She wrote to her every week. She&#8217;ll never know how much that meant to my mother.&#8221;<br />
Richard then told in a humorous way of how his mother&#8217;s religiosity weighed him down literally:<br />
&#8220;My mother was very religious. She used to pin holy medals to my vest as a child. When I walked I rattled.<br />
&#8220;She used to rub holy water, Knock water and St. Anne&#8217;s oil in my eyes and someone said I was lucky I didn&#8217;t drown.&#8221;<br />
Being serious, he added:<br />
&#8220;My mother&#8217;s prayers were that I&#8217;d get my eyesight back. Well I didn&#8217;t but I got a hell of a lot more out of life. You can take away someone&#8217;s eyesight but you can&#8217;t take away their vision and mine is Chrildren in Crossfire.&#8221;<br />
&#8211; Report by Allen Meagher</p>', 'LIVE REPORT – CHILDREN IN CROSSFIRE DIRECTOR, THE MAN WHO BROUGHT THE DALAI LAMA TO IRELAND Richard Moore from Children In Crossfire introduced the 14th Dalai Lama in Dublin this morning. Richard set up the NGO some years after losing his eyesight as a child to a British bullet in Derry in the 1970s. Richard said', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 297, 1, '2011-04-13T11:07:00Z', '2019-07-09T15:58:26Z', '2011-04-13T11:07:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('DALAI LAMA – LIVE REPORT FROM SAGGART', 'dalai-lama-live-report-from-saggart', '<div><a href="https://1.bp.blogspot.com/-RRY2QMm1Cx0/TaVxI8xOLPI/AAAAAAAAAPk/bpovnxTrkEk/s1600/photo-734348.JPG"><img decoding="async" alt="" border="0" src="https://1.bp.blogspot.com/-RRY2QMm1Cx0/TaVxI8xOLPI/AAAAAAAAAPk/bpovnxTrkEk/s320/photo-734348.JPG" /></a></div>
<p>INTRO<br />This is a live report from Saggart, Co. Dublin, oddly named after the Irish word for &#8220;priest.&#8221;<br />The theme of today is activism and taking action, but the Dalai Lama speaks here of nurturing peace within the individual and within society. ALLEN MEAGHER reports:<br /><a name=''more''></a><br />LIVE REPORT<br />&#8220;No-one on this planet inspires people more than the Dalai Lama,&#8221; says Children in Crossfire director, Dr Richard Moore.<br />Dalai Lama spoke, beginning by recalling how in 1959 the Irish Government was supportive of the Tibetan cause.<br />A small nation can produce some wonderful people, he said giving the example of a daughter of one of the victims of the Omagh bomb whom he met this morning.<br />&#8220;But she showed no sign of anger or hate.&#8221; <br />He said that was wonderful and laughed his characteristic laugh.<br />&#8220;We all want happiness, a peaceful life. The source of happiness is not money. Billionaires are deeply unhappy people, they have too much anxiety. Have an open mind, take a holistic approach&#8230; these are the basis of inner strength, inner peace.<br />&#8220;Wherever I go I try to share with other people that you should look inwards, the source of happiness is inside.&#8221;<br />He said sports, dance and so on were &#8220;useful&#8221; but said the ultimate source of happiness is within us. <br />He referred to the man who invited him to Ireland Richard Moore as a &#8220;hero&#8221; and a happy person.<br />DM referred to the British solider (he probably means policeman) who was shot. <br />He talked of the promotion of religious harmony &#8211; &#8220;Here you need more effort.&#8221;<br />He previously visited NI twice and remarks with irony, &#8220;Both (communities) are followers of Jesus Christ.&#8221;<br />&#8220;I&#8217;m a Buddhist. We have no idea of a creator.&#8221;<br />But he said he admired the deep spiritual practise of Christian &#8220;monks&#8221; he met in NI. <br />HE SAID THAT DURING THE 2 DAYS OF HIS VISIT TO IRELAND, HE CALLED FOR A LIFELONG COMMITTMENT TO PEACE.<br />Answering media questions, he said in reference to the high rate of mental health illnesses in Ireland &#8211; He said societies where people look outside themselves for happiness were faulty (I&#8217;m summarising not quoting).<br />&#8220;People put too much emphasis on material values. And also, the lack of experience of inner values. Self-confidence reduces anxiety and stress. Inner strength also brings genuine friendship, because you&#8217;re behaving honestly, openly.<br />&#8220;The basis of genuine friendship is trust.&#8221;<br />He said he has now stepped down as the political leader of the Tibetian movement (for freedom from China&#8217;s colonialisation of his country).<br />The press conference continues&#8230; more shortly perhaps!<br />Why is Changing Ireland here today &#8211; the Possibilities conference is about people taking action for change, it&#8217;s about nurturing community activism.</p>', 'INTROThis is a live report from Saggart, Co. Dublin, oddly named after the Irish word for “priest.”The theme of today is activism and taking action, but the Dalai Lama speaks here of nurturing peace within the individual and within society. ALLEN MEAGHER reports:LIVE REPORT“No-one on this planet inspires people more than the Dalai Lama,” says', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 298, 1, '2011-04-13T09:25:00Z', '2011-04-13T09:25:00Z', '2011-04-13T09:25:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('STRIKING COMMUNITY WORKERS WIN IN LABOUR COURT', 'striking-community-workers-win-in-labour-court', '<div><span>The strike involving community workers at&nbsp;</span><span><span>Meitheal Forbartha na Gaeltachta (MFG)&nbsp;</span></span><span>has been resolved, according to a report today from the&nbsp;Community Worker&#8217;s Co-op and confirmed by SIPTU</span><span>.&nbsp;</span></div>
<div><span>All local work under the Local and Community Development Programme &#8211; among other work carried out by the not-for-profit company &#8211; had come to a halt as ten workers went on strike after four of them were issued with redundancy notices.</span></div>
<div><span><span>It was </span><a href="https://www.blogger.com/goog_2102562289"><span><span>the first</span></span></a></span><span><a href="https://www.irishtimes.com/newspaper/ireland/2011/0411/1224294394594.html"><span><span>&nbsp;industrial strike in the State’s largest Gaeltacht in 30 years</span></span></a><span><span> </span></span><span>and&nbsp;</span></span><span><span>the Labour Court yesterday &#8220;found in favour of the workers, ordered the redundancies to be removed and staff reinstated, and a mediator to be appointed,&#8221; said the CWC statement.</span></span></div>
<div><span><span>The workers were </span><a href="https://www.siptu.ie/PressRoom/NewsReleases/2011/Name,14188,en.html"><span>supported by their union SIPTU</span></a><span>&nbsp;which&nbsp;</span></span><span><span>argued that the redundancies were not required and that alternative solutions to cost saving at the company can be achieved.</span></span></div>
<div><span><span>MFG Teo is based in Connemara and provides vital services to the most vulnerable communities in the area.&nbsp;</span></span></div>
<div><span><span><span>You can watch a video interview &#8211; prior to the Labour Court announcement &#8211; with one of the striking workers here.</span></span></span></div>
<div><span><span><span>Normal work resumed today.</span></span></span></div>
<div><span><span><br /></span></span></div>
<div><object class codebase="https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" height="266" width="320"><param name="movie" value="https://www.youtube.com/v/8Ry9zQTsIR0&#038;fs=1&#038;source=uds" /><param name="bgcolor" value="#FFFFFF" /><embed width="320" height="266" src="https://www.youtube.com/v/8Ry9zQTsIR0&#038;fs=1&#038;source=uds" type="application/x-shockwave-flash"></embed></object></div>', 'The strike involving community workers at Meitheal Forbartha na Gaeltachta (MFG) has been resolved, according to a report today from the Community Worker’s Co-op and confirmed by SIPTU. All local work under the Local and Community Development Programme – among other work carried out by the not-for-profit company – had come to a halt as ten workers went', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 299, 1, '2011-04-12T12:18:00Z', '2011-04-12T12:18:00Z', '2011-04-12T12:18:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('WATCH the Dalai Lama, Mary Robinson, Rita Fagan online TOMORROW!', 'watch-the-dalai-lama-mary-robinson-rita-fagan-online-tomorrow', '<div><a href="https://4.bp.blogspot.com/-L788ki89txY/TaQ5Q9GSNOI/AAAAAAAAAPY/jZgp8zz4bd8/s1600/1231.png"><img loading="lazy" decoding="async" border="0" height="300" src="https://4.bp.blogspot.com/-L788ki89txY/TaQ5Q9GSNOI/AAAAAAAAAPY/jZgp8zz4bd8/s400/1231.png" width="400" /></a></div>
<p><i>CAPTION: Tomorrow&#8217;s gig-like event is one of the biggest ever for Irish activists. If you can&#8217;t go, you can follow it via a live webcast <a href="https://www.possibilities.ie/">on this site</a>.</i></p>
<p><span>TODAY of all days, <a href="https://www.blogger.com/%28https://www.irishtimes.com/newspaper/opinion/2011/0412/1224294483327.html%29.">Fintan O&#8217;Toole wrote</a> about the Irish people&#8217;s failure to rise up and protest and lamented the lack of activism. He&#8217;s correct to a point but he took no account in his article of activism that is happening and tomorrow just happens to see one of the biggest activist gatherings in years.<a name=''more''></a>&nbsp;</span><br /><span><br /></span><br /><span><span><span>John Monaghan from Pobal Chill Chomain in Erris is going to appear in front of 2000 people at <a href="https://www.possibilities.ie/social-forum/">the &#8216;Possibilities&#8217; event in Dublin tomorrow.</a> Maybe most people are turning up to hear/see the Dalai Lama, Mary Robinson and Kila. But this gig is sold-out and the message is that taking action for change is something we all have a duty to do. It&#8217;s about activism, led by some of most notable activists of our era. The Government is interested in nurturing entrepreneurship in our schools, but there are many others in civil society interested in nurturing a sense of real civic responsibility and a duty to engage, to protest, to stand up for people&#8217;s rights. <br />Tomorrow&#8217;s gig is intended as an event that&#8217;s part of a movement (www.possibilities.ie) like the many others we&#8217;ve listed in Changing Ireland magazine &#8211; Claiming Our Future, 2nd Republic, New Beginnings, Direct Democracy, People&#8217;s Convention, New Vision and more. However, the Possibilities movement may be the biggest to emerge from the collapse of financial capitalism yet. <br />If only the enemy &#8211; greed/ignorance/oppression &#8211; lived in a house in Dublin and people could lay siege outside, Egyptian style, taking direct action that the Dalai Lama and John Monaghan would be proud of. <br />Don&#8217;t write off the people in Ireland yet! <br />People may one day go to jail for all that went on.</span></span></span><br /><span><span><span>By the way, one of the guests making a presentation tomorrow is community development worker Rita Fagan from St. Michael&#8217;s Estate in Inchicore, Dublin. The project she co-ordinates is funded under the <a href="https://docs.google.com/viewer?a=v&amp;pid=explorer&amp;chrome=true&amp;srcid=0Bw2kPUIQq1MbODNkNjQ1NTgtOTU5ZS00Yzg1LTg2ODktMjUwMzMzMWIyM2I5&amp;hl=en&amp;pli=1">Local and Community Development Programme.</a></span></span></span><br /><span><span>The event has been organised by three not-for-profits, namely AfrI, Spunout and Children In Crossfire.&nbsp;</span></span><br /><span><span><span><i>&#8211; Allen Meagher, editor, &#8216;Changing Ireland&#8217;</i></span></span></span></p>', 'CAPTION: Tomorrow’s gig-like event is one of the biggest ever for Irish activists. If you can’t go, you can follow it via a live webcast on this site. TODAY of all days, Fintan O’Toole wrote about the Irish people’s failure to rise up and protest and lamented the lack of activism. He’s correct to a', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 300, 1, '2011-04-12T11:46:00Z', '2011-04-12T11:46:00Z', '2011-04-12T11:46:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('AN OPPORTUNITY TO SHOW THE GOOD THAT’S GOING ON IN YOUR AREA!', 'an-opportunity-to-show-the-good-thats-going-on-in-your-area', '<div><a href="https://3.bp.blogspot.com/-FINRC4HBbrU/TZz1KT3n4BI/AAAAAAAAAPA/w7mlxa9EaHk/s1600/lightbulb-idea.jpg"><img loading="lazy" decoding="async" border="0" height="320" src="https://3.bp.blogspot.com/-FINRC4HBbrU/TZz1KT3n4BI/AAAAAAAAAPA/w7mlxa9EaHk/s320/lightbulb-idea.jpg" width="320" /></a></div>
<p>A reporter with one of the most-listened to and highly-regarded radio programmes in the country is looking for uplifting community development stories. He&#8217;s particularly interested in stories from the North-West and border counties for some reason. Give us a shout (061-458011) or email (editor@changingireland.ie) and we&#8217;ll put you in contact.<br />C&#8217;MON FOLKS! &#8211; AN OPPORTUNITY TO SHOW THE GOOD THAT&#8217;S GOING ON IN YOUR AREA!</p>', 'A reporter with one of the most-listened to and highly-regarded radio programmes in the country is looking for uplifting community development stories. He’s particularly interested in stories from the North-West and border counties for some reason. Give us a shout (061-458011) or email (editor@changingireland.ie) and we’ll put you in contact.C’MON FOLKS! – AN OPPORTUNITY TO', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 301, 1, '2011-04-06T22:20:00Z', '2019-09-13T10:53:58Z', '2011-04-06T22:20:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('Community development feature from Palestine', 'community-development-feature-from-palestine', '<p><span><b><span>IN MEMORY OF PEACEMAKER JULIANO MER KHAMIS</span></b></span></p>
<div><a href="https://www.blogger.com/goog_529932275"><span><img decoding="async" border="0" height="200" src="https://3.bp.blogspot.com/-fXEKoTHo6xw/TZyET7YlcTI/AAAAAAAAAO8/8jQb9NAlc20/s200/JulianoMerKhamis.jpg" width="200" /></span></a></div>
<p><i><span>Juliano Mer Khamis (pictured) was an Israeli&nbsp;</span></i><span><i><span>actor and peace activist who ran a drama project in a Palestinian refugee camp in Jenin, the West Bank. He was assassinated on Monday outside the theatre he founded which had brought Israelis and Palestinians together.</span></i></span><br /><span><i><span>One year ago, Changing Ireland Community Media Ltd&#8217;s chairperson, Gearoid Fitzgibbon, then a reporter for our magazine project, worked in Palestine as a volunteer.</span></i></span><br /><span><i><span>In memory of the late Juliano Mer Khamis, we republish Gearoid&#8217;s article which focused on a camera project involving Israeli and Palestinian youths.&nbsp;</span></i></span><br /><span><i><span>The article is also available online in PDF format at:&nbsp;</span><span><a href="https://changingireland.ie/Issue32.pdf">https://changingireland.ie/Issue32.pdf</a>&nbsp;</span></i></span><br /><span><i><span></span></i></span><span><b><span>Lessons in Community Work &#8211;&nbsp;</span></b></span><span><b><span>Gearoid Fitzgibbon reports from Hebron</span></b></span><br /><span><b><span>   </span></b></span><br /><span><b><span></span></b></span><br /><span><b><span></p>
<div>
<div><a href="https://1.bp.blogspot.com/-wgPwhmmXKUI/TZz1wW5FloI/AAAAAAAAAPE/clhpubLAOng/s1600/PALESTINE-english+class+3+boys+group.jpg"><img fetchpriority="high" decoding="async" border="0" height="240" src="https://1.bp.blogspot.com/-wgPwhmmXKUI/TZz1wW5FloI/AAAAAAAAAPE/clhpubLAOng/s320/PALESTINE-english+class+3+boys+group.jpg" width="320" /></a></div>
<p><span lang="EN-GB"><span><span>PHOTO (ABOVE): Gearoid Fitzgibbon in a classroom with boys in Palestine.</span></span></span><br /><span lang="EN-GB"><span><span>If you think of Israel/Palestine, your first image may not be of a Community Centre in the heart of the occupation, jointly funded and run by a group of Israelis and Palestinians.<a name=''more''></a><o:p></o:p></span></span></span></div>
<div></div>
<div><span lang="EN-GB"><span><span>Mich’ael Zupraner is a Harvard graduate and Israeli documentary maker. For nearly 2 years he has shared his skills in Hebron with other Palestinians and Israelis to oppose the occupation. Here, in the middle of Hebron, with its checkpoints, detentions, house searches and army patrols, Mich’ael, and local Hebronite, Issa Amro, a lecturer in Electrical Engineering, have worked to develop an innovative community project right next to an Israeli settlement. They and a group of committed Palestinian and Israeli nonviolent activists set up a community centre and community television station (www.heb2.tv) in an ‘ordinary’ house in Tel Rumeida, in Hebron, that Israeli settlers were planning to take over.<o:p></o:p></span></span></span></div>
<div></div>
<div><span lang="EN-GB"><span><span>According to Mich’ael “The principal idea is to empower members of community to communicate outwards. This part of directly occupied Hebron (H2), is under political, economic and cultural closure and few people on the outside get to see or hear what is happening here.”<o:p></o:p></span></span></span></div>
<div></div>
<div><span lang="EN-GB"><span><span>As someone with a background as a volunteer and latterly paid community worker in Ireland, the centre in Tel Rumeida is an inspiration. The activists are training and empowering the community of Tel Rumeida, how to resist the occupation nonviolently, and deal with the intimidation of the soldiers and armed settlers. If the residents respond aggressively it only serves as an excuse for further harassment. The Heb 2 Community House offers training in nonviolence, video editing, and foreign languages to young and old members of the local community.<o:p></o:p></span></span></span></div>
<div></div>
<div><span lang="EN-GB"><span><span>JUST BEING THERE IS RESISTING<o:p></o:p></span></span></span></div>
<div><span lang="EN-GB"><span><span>The very existence of the Heb 2 Community House, in itself, is an achievement. Located at a strategic point, near one of the Israeli settlements, in a Palestinian neighbourhood, the house was occupied by the Israeli army in 2001, at beginning of 2nd Intifada, or uprising. The owner, originally from Jerusalem, was told that he would lose his Jerusalem residency if he stayed. When the army finally left in 2005, the house lay in ruins.<o:p></o:p></span></span></span></div>
<div></div>
<div><span lang="EN-GB"><span><span>In 2007, local activist Issa Amro, concerned that a group of settlers would take over the house, met the owner, and offered to rent the house, and keep it from being occupied. With support from Israeli Human Rights organisations (B’Tselem and the Israeli Council Against House Demolitions – one of the organisations funded by Irish Aid), the activists managed to get the tenancy recognoised in the Israeli counts. The settlers tried to scare them off. The army even detained Issa saying he wasn’t allowed to be there, despite having all the correct legal papers.<o:p></o:p></span></span></span></div>
<div></div>
<div><span lang="EN-GB"><span><span>Eventually, when they finally managed to move in, they found themselves under constant attack by the settlers. The would-be community house had to be monitored 24 hours per day, to prevent it being destroyed or burned. Settlers, armed with M16s, had to be physically blocked by the local Palestinians, supported by Israeli activists, armed only with cameras. With a grant from an Israeli NGO, a group of Israelis and Palestinians renovated the house. It is only in the last 18 months, that the attacks have decreased to the level of verbal argument.<o:p></o:p></span></span></span></div>
<div></div>
<div><span lang="EN-GB"><span><span>FROM DERELICT HOUSE TO COMMUNITY CENTRE<o:p></o:p></span></span></span></div>
<div><span lang="EN-GB"><span><span>With the house now becoming a more secure base, those involved began to discuss how to use it. According to Issa, from the very beginning the idea was to have a space open to all the community. Although the House now has huge support from the community, at the beginning every one said that it was impossible. People felt powerless to change the nature of the occupation, and thought that the Israeli army would punish them more because of it.<o:p></o:p></span></span></span></div>
<div></div>
<div><span lang="EN-GB"><span><span>Within a short time of my arriving in Hebron in August 2009, it was clear to me that something very innovative and brave was going on here. Issa asked me to help out and over the next 2 months, and together with another human rights volunteer (an American Jewish man originally from New York) we ran English classes with the local children there. As part of this, we set up an exchange with Villiers School in Limerick City, and the young students recorded a tour of their area in English. (see ‘teamhebron’ videos on youtube). Since then, the young people I taught have gone on to start a film and video class with documentary maker Micha’el.<o:p></o:p></span></span></span></div>
<div><span><br /></span></div>
<div><span lang="EN-GB"><span><span>COUNTERING MAINSTREAM MEDIA DISTORTION<o:p></o:p></span></span></span></div>
<div><span lang="EN-GB"><span><span>Speaking to Mich’ael, I am surprised to discover that he does not see himself as an activist: “I am NOT an activist. The occupation is the defining circumstance of Israelis and Palestinians’ lives. I am lucky that I have the possibility to do something practical to directly affect the situation.“<o:p></o:p></span></span></span></div>
<div><span lang="EN-GB"><span><span>Mich’ael is highly critical of what he calls the virtualisation of the conflict, in a way that could apply to conflicts in Ireland also: “There is too much symbolic action in the West Bank, and a virtualisation of the conflict takes place. The media coverage overwhelms what is actually happening on the ground. It’s become a sort of public relations war. You are merely producing images for the media. It becomes all about spokesmanship and not the reality.”<o:p></o:p></span></span></span></div>
<div></div>
<div><span lang="EN-GB"><span><span>The Heb 2 Community House, Mich’ael stressed, was not about making vain symbolic gestures: “Most video activism is just videoing of demonstrations. This project isn’t a demonstration, or a symbolic act, like holding up a sign. What we’re doing in Tel Rumeida isn’t a photo op. Here in Tel Rumeida, we are giving concrete skills to the community, communication skills, videoing skills etc.”<o:p></o:p></span></span></span><br /><span lang="EN-GB"><span><span><br /></span></span></span></div>
<div><span lang="EN-GB"><span><span>ARABS AND JEWS CELEBRATE COMMUNITY WORK<o:p></o:p></span></span></span></div>
<div><span lang="EN-GB"><span><span>New Year’s Eve 2009. Tel Rumeida, Hebron. Instead of the usual deathly silence, and climate of fear which pervades the neighbourhood, the cold air is set alight by the sound of music and dance in the garden in front of the Heb 2 Community House. A group of former Israeli soldiers are dancing arm in arm with the local Palestinian activists. The Israelis, founder members of Breaking The Silence, (a group of ex-soldiers who have collected testimonies on the behaviour of the Israeli Army in the West Bank) have been invited to celebrate the first year in existence of Heb 2 Community House. A P.A. system has been set up, and Issa Amro calls over the microphone, and one by one, Palestinians, Israelis and Internationals, come and accept a small gift of thanks from the community. There must be over 100 people here tonight, Palestinians, Israelis, and Internationals, Christian, Muslim, Jewish and nonbeliever.&nbsp; When peace at last is created in this beautiful land, these people here will be among its heros. But how long more will they have to travel? As with South Africa, international solidarity with the peace makers is crucial. Find a way, any way you can, to contribute to the peacebuilding of these people.<o:p></o:p></span></span></span></div>
<div><span lang="EN-GB"><span><span>* To volunteer visit www.eappi.org OR to find out more, contact Gearoid. E: fitzgibbong@gmail.com<o:p></o:p></span></span></span></div>
<div><span lang="EN-GB"><span><span>M: 0857409023.<o:p></o:p></span></span></span></div>
<div></div>
<div><span lang="EN-GB"><span><span>SHOOTING BACK – A CAMERA DISTRIBUTION PROJECT<o:p></o:p></span></span></span></div>
<div><span lang="EN-GB"><span><span>Issa Amro and Mich’ael Zupraner founded the ground-breaking camera distribution project in Hebron. In March 2007, Mich’ael and Issa gave out cameras to neighbours in Tel Rumeida. The first cameras were purchased by an Israeli group called Children of Abraham. This group asked Mich’ael to buy cameras, and come and train people to use them. “We gave cameras to people initially to document their suffering, and harassment by settlers or soldiers. But of course, people also filmed birthdays, weddings, and celebrations!” Now, there are dozens of cameras in Hebron.<o:p></o:p></span></span></span></div>
<div><span lang="EN-GB"><span><span>According to Issa: “These cameras are a tool to document the human rights abuses and improve people’s security and safety. At the same time, they allow the Palestinians here to express how they live.” <o:p></o:p></span></span></span></div>
<div></div>
<div><span lang="EN-GB"><span><span>SHOOTING BACK – A CAMERA DISTRIBUTION PROJECT<o:p></o:p></span></span></span></div>
<div><span lang="EN-GB"><span><span>Issa Amro and Mich’ael Zupraner founded the ground-breaking camera distribution project in Hebron. In March 2007, Mich’ael and Issa gave out cameras to neighbours in Tel Rumeida. The first cameras were purchased by an Israeli group called Children of Abraham. This group asked Mich’ael to buy cameras, and come and train people to use them. “We gave cameras to people initially to document their suffering, and harassment by settlers or soldiers. But of course, people also filmed birthdays, weddings, and celebrations!” Now, there are dozens of cameras in Hebron.<o:p></o:p></span></span></span></div>
<div><span lang="EN-GB"><span><span>According to Issa: “These cameras are a tool to document the human rights abuses and improve people’s security and safety. At the same time, they allow the Palestinians here to express how they live.”</span></span></span></div>
<p></span></b></span></p>
<div>
<div>
<div>
<div>
<div>
<div>
<div><b></b><br /><b></b><br /><b></p>
<div>
<div>
<div>
<div>
<div></div>
</div>
</div>
</div>
</div>
<p></b></div>
</div>
</div>
</div>
</div>
</div>
</div>', 'IN MEMORY OF PEACEMAKER JULIANO MER KHAMIS Juliano Mer Khamis (pictured) was an Israeli actor and peace activist who ran a drama project in a Palestinian refugee camp in Jenin, the West Bank. He was assassinated on Monday outside the theatre he founded which had brought Israelis and Palestinians together.One year ago, Changing Ireland Community Media', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 302, 1, '2011-04-06T13:44:00Z', '2019-09-13T10:54:03Z', '2011-04-06T13:44:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('Dessie O’Halloran in fundraiser for Inishbofin', 'dessie-ohalloran-in-fundraiser-for-inishbofin', '<div></div>
<div>
<div><a href="https://1.bp.blogspot.com/-Bl5WDPO4djA/TZXYehFvCxI/AAAAAAAAANU/Mge6UaO746c/s1600/photo-713878.JPG"><img decoding="async" alt="" border="0" height="400" src="https://1.bp.blogspot.com/-Bl5WDPO4djA/TZXYehFvCxI/AAAAAAAAANU/Mge6UaO746c/s400/photo-713878.JPG" width="300" /></a></div>
<div>
<div><span>Dessie O&#8217;Halloran (above) was joined by dancers and a band of musicians for a fundraiser last night for&nbsp;</span><a href="https://www.inishbofin.com/community.html"><span>Inishbofin Community Development Project</span></a><span>.&nbsp;</span></div>
<div><span>The gig was held in Monroe&#8217;s of Galway.</span></div>
</div>
<div>
<div><span>Eleanor Shanley and Dessie sang together (pictured) and the band included lead box player Johnny O&#8217;Halloran (also pictured). Johnny is&nbsp;</span><span>a nephew of Dessie&#8217;s who turned 70 last year.</span></div>
</div>
<div>
<div><span>All-Ireland&nbsp;</span><span>sean-nós dancing champion Emma O’Sullivan</span><span>&nbsp;also performed and you can watch our <a href="https://www.youtube.com/user/changingireland#p/u/0/gpTVfxvZtBk">video of Emma dancing by clicking here.</a></span></div>
</div>
<div>
<div><span>Meanwhile,</span><a href="https://www.inishbofin.com/arts_festival.html"><span>&nbsp;Inishbofin&#8217;s annual arts festival</span></a><span>&nbsp;takes place from May 6-8</span><sup><span><span>th</span></span></sup><span>, a great occasion for visiting the island. This year’s line-up includes De Dannan, Gemma Hayes and band and Peadar King and band.<o:p></o:p></span></div>
</div>
<div><span>The island&#8217;s</span><span><span>&nbsp;inaugural Inishbofin Walking Festival runs from May 27 to 29.</span></span></div>
<div><span><span></span></span><i><b><span>Photos:&nbsp;</span></b><span>Breda Lymer</span></i></div>
<div><a href="https://2.bp.blogspot.com/-YSQrjiF4EAA/TZsyeIlTPOI/AAAAAAAAAOg/YINjQtAWl2A/s1600/Inishbofin+2011+fundraiser+fiddle-player.JPG"><img loading="lazy" decoding="async" border="0" height="320" src="https://2.bp.blogspot.com/-YSQrjiF4EAA/TZsyeIlTPOI/AAAAAAAAAOg/YINjQtAWl2A/s320/Inishbofin+2011+fundraiser+fiddle-player.JPG" width="240" /></a><a href="https://1.bp.blogspot.com/-vwX974TjGLk/TZsyJ1bTq7I/AAAAAAAAAOc/cfxh-pdTpXg/s1600/Inishbofin+2011+fundraiser+Emma+O%2527Sullivan.JPG"><img loading="lazy" decoding="async" border="0" height="320" src="https://1.bp.blogspot.com/-vwX974TjGLk/TZsyJ1bTq7I/AAAAAAAAAOc/cfxh-pdTpXg/s320/Inishbofin+2011+fundraiser+Emma+O%2527Sullivan.JPG" width="240" /></a></div>
<div><a href="https://1.bp.blogspot.com/-vwX974TjGLk/TZsyJ1bTq7I/AAAAAAAAAOc/cfxh-pdTpXg/s1600/Inishbofin+2011+fundraiser+Emma+O%2527Sullivan.JPG"></a>   </div>
<div><span>PHOTO (ABOVE):&nbsp;All-Ireland sean-nos champion Emma O&#8217;Sullivan<o:p></o:p></span></div>
<div><a href="https://3.bp.blogspot.com/-l56KTeRaTm8/TZsyw_l0l2I/AAAAAAAAAOk/b7podCqt-vE/s1600/Inishbofin+2011+fundraiser+Johnny+O%2527Halloran.JPG"><img loading="lazy" decoding="async" border="0" height="320" src="https://3.bp.blogspot.com/-l56KTeRaTm8/TZsyw_l0l2I/AAAAAAAAAOk/b7podCqt-vE/s320/Inishbofin+2011+fundraiser+Johnny+O%2527Halloran.JPG" width="240" /></a></div>
<div><a href="https://3.bp.blogspot.com/-l56KTeRaTm8/TZsyw_l0l2I/AAAAAAAAAOk/b7podCqt-vE/s1600/Inishbofin+2011+fundraiser+Johnny+O%2527Halloran.JPG"></a><span>PH</span><span>OTO (ABOVE): Johnny O&#8217;Halloran</span></div>
<div><a href="https://3.bp.blogspot.com/-l56KTeRaTm8/TZsyw_l0l2I/AAAAAAAAAOk/b7podCqt-vE/s1600/Inishbofin+2011+fundraiser+Johnny+O%2527Halloran.JPG"></a><a href="https://3.bp.blogspot.com/-bjtFXSQ0apg/TZsx0wgfd8I/AAAAAAAAAOY/HwwReBvMin0/s1600/Inishbofin+2011+fundraiser+Dessie+and+Eleanor.JPG"><img loading="lazy" decoding="async" border="0" height="320" src="https://3.bp.blogspot.com/-bjtFXSQ0apg/TZsx0wgfd8I/AAAAAAAAAOY/HwwReBvMin0/s320/Inishbofin+2011+fundraiser+Dessie+and+Eleanor.JPG" width="240" /></a></div>
<div></div>
<div><span>PHOTO (ABOVE): Dessie O&#8217;Halloran and Eleanor Shanley</span><a href="https://1.bp.blogspot.com/-sVIEsVa5rqg/TZszem81d_I/AAAAAAAAAOo/s4QkjTCBsIQ/s1600/Band+at+Inishbofin+fundraiser+%2528Pic+by+Breda+Lymer%2529.JPG"><img loading="lazy" decoding="async" border="0" height="266" src="https://1.bp.blogspot.com/-sVIEsVa5rqg/TZszem81d_I/AAAAAAAAAOo/s4QkjTCBsIQ/s400/Band+at+Inishbofin+fundraiser+%2528Pic+by+Breda+Lymer%2529.JPG" width="400" /></a></div>
<p><span><span><i></i></span></span><br /><span><i></i></span><br /><i></i><br /><i></i><br /><i></p>
<div></div>
<p></i></div>', 'Dessie O’Halloran (above) was joined by dancers and a band of musicians for a fundraiser last night for Inishbofin Community Development Project. The gig was held in Monroe’s of Galway. Eleanor Shanley and Dessie sang together (pictured) and the band included lead box player Johnny O’Halloran (also pictured). Johnny is a nephew of Dessie’s who turned 70', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 303, 1, '2011-04-01T12:44:00Z', '2019-09-13T10:54:09Z', '2011-04-01T12:44:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('DRAMA IN MOYROSS AFTER POUND PANIC TODAY', 'drama-in-moyross-after-pound-panic-today', '<p><a href="https://2.bp.blogspot.com/-7AFzVcmK-jI/TZC3CDZfLKI/AAAAAAAAANM/qdfx8aeGpeg/s1600/images.jpeg"><img decoding="async" alt="" border="0" src="https://2.bp.blogspot.com/-7AFzVcmK-jI/TZC3CDZfLKI/AAAAAAAAANM/qdfx8aeGpeg/s320/images.jpeg" /></a><span><span>   </span></span></p>
<div><span lang="EN-GB"><span><span>Young children and their mothers walking home from primary school in Moyross had to run for safety this afternoon or risk being trampled by a loose bunch of ponies and horses.</span></span></span></div>
<div><span lang="EN-GB"><span><span>The dozens of horses kept in Moyross cause no trouble for people normally, but on this occasion a herd mounted a footpath at a gallop after a local adult panicked them. He was taking part in a round-up after word went around that the pound were in Moyross to take away animals. The drama unfolded outside ‘Changing Ireland’s front door.</span></span></span></div>
<div><span lang="EN-GB"><span><span>One of the mothers expressed her anger afterwards. She cursed the Gardai and the pound for coming out “at this hour”, saying such work should be conducted by night – certainly not while children are on their way home from school.</span></span></span></div>
<div><span lang="EN-GB"><span><span>Meanwhile, dozens of horse-owning youngsters anxious about their animals ran to the field the pound normally targets. As residents and community workers will tell you, t</span></span></span><span>he pound </span><span>likes to pick on the well-kept horses that are tied, rather than chase after animals that are loose and are a genuine danger.</span></div>
<div><span lang="EN-GB"><span><span>The pound – which is privately run &#8211; has been condemned for this approach for years but nothing has changed. </span></span></span></div>
<div><span lang="EN-GB"><span><span>The Control of Horses Act is 15 years old this year and is detested locally. It has made it illegal to own horses in urban areas, alienating many youngsters and costing the State millions in payments to the pound people. However, despite the fact that thousands of horses have been impounded, this approach has failed to kill off the urban horse culture. </span></span></span></div>
<div><span lang="EN-GB"><span><span>When it was introduced, there was talk of horse projects for neighbourhoods where many of the residents like horses, but nothing came of such promises in Limerick. For 14 years, the Community Development Network Moyross tried alongside the horse-owners but the powers-that-be stone-walled every approach.</span></span></span></div>
<div><span lang="EN-GB"><span><span> “They’d be better off spending the money they waste on the pound by using it to set up a horse project. All we want is a place where we can keep our horses and look after them,” said one local horse-owner.</span></span></span></div>
<div><span lang="EN-GB"><span><span>Editor, Allen Meagher, is currently investigating what can be done from a community perspective to preserve and nurture the horse culture safely both here in Limerick and in other parts of the country.</span></span></span></div>
<div><span lang="EN-GB"><span><span>Horses, in our experience, are generally well looked after by people here and some are exceptionally well cared for. A story of horse-cruelty in the area some weeks ago received hours of local radio coverage but the story was greeted with incredulity by many locals here and questions have been asked about the story’s veracity.</span></span></span></div>
<div><span lang="EN-GB"><span><span>“If it’s true, it’s disgusting,” said one local horse owner. “If I found people hurting a horse, I don’t want to tell you what I’d do to them.”</span></span></span></div>
<div><span lang="EN-GB"><span><span>Meanwhile, everytime the pound visits Limerick there is drama, but it is rare that people find themselves in such danger as occurred today.</span></span></span></div>
<div><span lang="EN-GB"><span><span>The outcomes would be very different if the local authority took a community development approach to the matter.</span></span></span></div>
<div><span lang="EN-GB"><span><span>Meanwhile, the Gardai are employed to officially close roads for car rally-races, yet sulkie-racing – potentially a tourism attraction if it was nurtured – is never accommodated.</span></span></span></div>
<div><span lang="EN-GB"><span><span>Incidentally, it costs around €1500 to get a horse back from the pound which makes the panic that erupts when the pound is seen approaching understandable.</span></span></span></div>
<div><span lang="EN-GB"><span><span>Most horse-owners never see their pets again.</span></span></span></div>
<div><span><b><span>COMMENTS WELCOME! YOU DON&#8217;T HAVE TO GIVE YOUR NAME.</span></b></span></div>', 'Young children and their mothers walking home from primary school in Moyross had to run for safety this afternoon or risk being trampled by a loose bunch of ponies and horses. The dozens of horses kept in Moyross cause no trouble for people normally, but on this occasion a herd mounted a footpath at a', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 304, 1, '2011-03-28T15:27:00Z', '2019-09-13T10:54:15Z', '2011-03-28T15:27:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('HORSES ARE THE HOOK!', 'horses-are-the-hook', '<p><img decoding="async" alt="" border="0" src="https://1.bp.blogspot.com/-sJHuTV4QzC8/TZBuwk3YrEI/AAAAAAAAAM0/6-iN7vnbBLI/s400/Lucy%2Bfrom%2BCherry%2BOrchard.JPG" /><span><i><a href="https://1.bp.blogspot.com/-sJHuTV4QzC8/TZBuwk3YrEI/AAAAAAAAAM0/6-iN7vnbBLI/s1600/Lucy%2Bfrom%2BCherry%2BOrchard.JPG">PICTURED ABOVE: Lucy.</a></i></span><br /><span><i><a href="https://1.bp.blogspot.com/-sJHuTV4QzC8/TZBuwk3YrEI/AAAAAAAAAM0/6-iN7vnbBLI/s1600/Lucy%2Bfrom%2BCherry%2BOrchard.JPG"></a></i></span><span><span><span>‎&#8221;It&#8217;s not all about the horses,&#8221; says Adeline O&#8217;Brien of Cherry Orchard Equine Centre. Watch our 2 min interview with Adeline here:<br /></span></span><a href="https://www.youtube.com/user/changingireland#p/u/0/0T1qBS9xxtA" rel="nofollow noopener noreferrer" target="_blank"><span><span><b>https://www.youtube.com/user/ch<wbr></wbr></b></span></span><span></span><span><span><b>angingireland#p/u/0/0T1qBS9xxt<wbr></wbr></b></span></span><span></span><span><span><b>A</b></span></span></a><span><span><br />The project is 8 years old, caters for 650 young people from Ballyfermot and is part-funded through the Local and Community Development Program</span></span><span><span><span>me.</span></span></span></span></p>
<div>
<div>
<div><a href="https://4.bp.blogspot.com/-Nt05zi0dvCc/TZsi4SYoQDI/AAAAAAAAAOE/ZYtaRkAFTRc/s1600/DSCF8613.JPG"><img loading="lazy" decoding="async" border="0" height="240" src="https://4.bp.blogspot.com/-Nt05zi0dvCc/TZsi4SYoQDI/AAAAAAAAAOE/ZYtaRkAFTRc/s320/DSCF8613.JPG" width="320" /></a></div>
<p>&nbsp;<span><i>PICTURED ABOVE: A young volunteer, one of the youngest in Ireland!</i></span></p>
<div><a href="https://4.bp.blogspot.com/-bAK9xC8gz84/TZsjNMu2H_I/AAAAAAAAAOI/bPh9C47dbxE/s1600/DSCF8603.JPG"><img loading="lazy" decoding="async" border="0" height="240" src="https://4.bp.blogspot.com/-bAK9xC8gz84/TZsjNMu2H_I/AAAAAAAAAOI/bPh9C47dbxE/s320/DSCF8603.JPG" width="320" /></a></div>
<p>&nbsp;<span><i>PICTURED ABOVE: Two young volunteers</i></span></p>
<div><a href="https://1.bp.blogspot.com/-r7clp4rNFSE/TZsjcKDKLOI/AAAAAAAAAOM/Txsgvu6wmeI/s1600/DSCF8618.JPG"><img loading="lazy" decoding="async" border="0" height="240" src="https://1.bp.blogspot.com/-r7clp4rNFSE/TZsjcKDKLOI/AAAAAAAAAOM/Txsgvu6wmeI/s320/DSCF8618.JPG" width="320" /></a></div>
<p>&nbsp;<span><i>PICTURED ABOVE: the indoor arena. Outside there is another arena, a gallop track and 12 acres for grazing.</i></span></p>
<div><a href="https://4.bp.blogspot.com/-XhcPDEIQu5w/TZsjqZlMPyI/AAAAAAAAAOQ/2LG39sdWDik/s1600/Cherry+Orchard%2527s+Adeline+O%2527Brien.JPG"><img loading="lazy" decoding="async" border="0" height="240" src="https://4.bp.blogspot.com/-XhcPDEIQu5w/TZsjqZlMPyI/AAAAAAAAAOQ/2LG39sdWDik/s320/Cherry+Orchard%2527s+Adeline+O%2527Brien.JPG" width="320" /></a></div>
<p>&nbsp;<span><i>PICTURED ABOVE: Adeline O&#8217;Brien, the boss.</i></span></p>
<div><a href="https://1.bp.blogspot.com/-OJyCzIAX6mQ/TZskR67FZbI/AAAAAAAAAOU/9Q1pOrv4VAE/s1600/DSCF8623.JPG"><img loading="lazy" decoding="async" border="0" height="240" src="https://1.bp.blogspot.com/-OJyCzIAX6mQ/TZskR67FZbI/AAAAAAAAAOU/9Q1pOrv4VAE/s320/DSCF8623.JPG" width="320" /></a></div>
<p><span><span><span><span><i></i></span></span></span></span><br /><span><span><span><span><i></p>
<div><span><span><span><span><i>PICTURED ABOVE: Staff members at reception</i></span></span></span></span></div>
<p></i></span></span></span></span></div>
</div>', 'PICTURED ABOVE: Lucy.‎”It’s not all about the horses,” says Adeline O’Brien of Cherry Orchard Equine Centre. Watch our 2 min interview with Adeline here:https://www.youtube.com/user/changingireland#p/u/0/0T1qBS9xxtAThe project is 8 years old, caters for 650 young people from Ballyfermot and is part-funded through the Local and Community Development Programme. PICTURED ABOVE: A young volunteer, one of the youngest', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 305, 1, '2011-03-28T10:16:00Z', '2019-09-13T10:54:22Z', '2011-03-28T10:16:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('(untitled 306)', '306', '<p><a href="https://2.bp.blogspot.com/-ABszSvodfXA/TZBtufNmskI/AAAAAAAAAMs/fP6sSISVWdU/s1600/RADIO%2BKERRY-LISTEN%2BNOW%2521.png"><img decoding="async" src="https://2.bp.blogspot.com/-ABszSvodfXA/TZBtufNmskI/AAAAAAAAAMs/fP6sSISVWdU/s400/RADIO%2BKERRY-LISTEN%2BNOW%2521.png" border="0" alt="" /></a><span ><span ><br />&#8216;CHANGING IRELAND&#8217;s Allen Meagher was interviewed about <a href="https://www.myorologireplica.it/prodotto/rolex-daytona-uomo-40mm-skeleton-limited-edition-tonalita-oro-rosa-automatico/">rolex daytona uomo 40mm skeleton limited edition tonalita oro rosa automatico</a> the anti-Traveller Facebook sites on Radio Kerry this <a href="https://www.alexandermcqueenreplica.re/product/alexander-mcqueen-76188-fashion-bracelets/">alexander mcqueen 76188 fashion bracelets</a> morning. Click here for a listen (6 mins): <a href="https://changingireland.ie/RadioKerryInterviewRacistSites.m4a">https://changingireland.ie/RadioKerryInterviewRacistSites.m4a</a></span></span></p>', '‘CHANGING IRELAND’s Allen Meagher was interviewed about rolex daytona uomo 40mm skeleton limited edition tonalita oro rosa automatico the anti-Traveller Facebook sites on Radio Kerry this alexander mcqueen 76188 fashion bracelets morning.', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 306, 1, '2011-03-28T10:14:00Z', '2023-12-15T01:18:32Z', '2011-03-28T10:14:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('File gone to DPP over Facebook’s anti-Traveller sites', 'file-gone-to-dpp-over-facebooks-anti-traveller-sites', '<div>
<div><img loading="lazy" decoding="async" src="https://changingireland.ie/wp-content/uploads/2011/03/Facebook-page-Pat-Kissane-and-Miroslav-lament-shutting-down-of-the-PTUOKBAB-site-24-CROPPED.png" alt="" width="949" height="321" srcset="https://changingireland.ie/wp-content/uploads/2011/03/Facebook-page-Pat-Kissane-and-Miroslav-lament-shutting-down-of-the-PTUOKBAB-site-24-CROPPED.png 949w, https://changingireland.ie/wp-content/uploads/2011/03/Facebook-page-Pat-Kissane-and-Miroslav-lament-shutting-down-of-the-PTUOKBAB-site-24-CROPPED-300x101.png 300w, https://changingireland.ie/wp-content/uploads/2011/03/Facebook-page-Pat-Kissane-and-Miroslav-lament-shutting-down-of-the-PTUOKBAB-site-24-CROPPED-768x260.png 768w" sizes="(max-width: 949px) 100vw, 949px" /></div>
</div>
<div>
<p><strong><em>CAPTION:</em></strong><em> Four anti-Traveller sites were removed by Facebook last year following complaints by community activists in the Republic and Northern Ireland. A file has now gone to the DPP in relation to one of the people behind one of the sites.</em></p>
</div>
<div>
<p>The file sent to the DPP is in relation to the ringleader and Gardai have not ruled out the possibility that others including Facebook Inc. which hosted the site may face charges.</p>
<p>Community workers in the Republic and Northern Ireland campaigned for weeks before the site and two others – which had garnered a fan-base of close to 10,000 over a year-long period – were removed last July by Facebook.</p>
<p>Sergeant Dave McInerney from the Garda Racial and Intercultural Office in Dublin confirmed the matter had been under investigation for some months and that a file in relation to one of the sites has now been sent to the DPP.</p>
<p>“No arrests were made but a number of individuals were questioned by Gardaí in Killarney as the file was being prepared. We received calls about the racist sites from all around the country,” he said.</p>
<p>He confirmed that if the case goes ahead, it will mark the first time that anyone is brought before the courts for publishing online racism.</p>
<p>Among those who filed the original complaints were members of Pavee Point, the Kerry Travellers Development Group and the Waterford Travellers Development Project. Each project is part of the Local and Community Development Programme which is committed to promoting equality and social inclusion and to challenging discrimination.</p>
<p>Pavee Point handed over evidence including the identities of close to a dozen people behind the sites.</p>
<p>A Traveller woman and community activist from Co. Kerry, Mary Boyne from Killarney said at the time, “We must make it our business to see that all members of Facebook who participated in these hate sites be reported and prosecuted.”</p>
</div>', 'Gardaí have confirmed that a file has been sent to the DPP in relation to the posting of racist material online by a man from Kerry. “Promote The Use Of Knacker Babies As Bait” was set up by four men in their 20s and 30s from Killarney, two of whom worked at the time in the tourism industry.', 'https://changingireland.ie/wp-content/uploads/2011/03/Iss-33-cover-3-FB-hate-sites.png', '', '[{"slug":"empowerment","title":"Empowerment"},{"slug":"equality-rights","title":"Equality & Rights"}]', '[]', '', 307, 1, '2011-03-23T10:44:00Z', '2022-02-05T17:11:57Z', '2011-03-23T10:44:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('100 YEARS AGO – 3 KEY WOMEN’S CAMPAIGNS BEGAN', '100-years-ago-3-key-womens-campaigns-began', '<p><a href="https://2.bp.blogspot.com/-532BWJP54wE/TXew036xq0I/AAAAAAAAAMc/ABbUSeVOPJA/s1600/Picture%2B15.png"><img decoding="async" src="https://2.bp.blogspot.com/-532BWJP54wE/TXew036xq0I/AAAAAAAAAMc/ABbUSeVOPJA/s400/Picture%2B15.png" border="0" alt="" /></a></p>
<div><span >International Women&#8217;s Day was marked around the country yesterday and much was celebrated in terms of how far we&#8217;ve come in 100 years.</span></div>
<div><span >Our photo here shows women working in a factory in Cork in 1911. </span></div>
<div><span >Working conditions were widely recognised as a problem at the time and women&#8217;s work unions began campaigning that year for clean and safe working conditions for themselves and for child-labourers.</span></div>
<div><span >Also in 2011, two other key campaigns began as women campaigned for the right to vote and for the right to equal pay.</span></div>
<div><span >It&#8217;s worth reflecting on how far we&#8217;ve come in 100 years on women&#8217;s rights! And how much work remains!</span></div>
<div><span ><br /></span></div>
<div><span ><br /></span></div>
<div><span ><br /></span></div>', 'International Women’s Day was marked around the country yesterday and much was celebrated in terms of how far we’ve come in 100 years. Our photo here shows women working in a factory in Cork in 1911. Working conditions were widely recognised as a problem at the time and women’s work unions began campaigning that year', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 308, 1, '2011-03-09T15:45:00Z', '2011-03-09T15:45:00Z', '2011-03-09T15:45:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('WIN OVER ‘HARD-TO-REACH’ PEOPLE IN YOUR COMMUNITY!', 'win-over-hard-to-reach-people-in-your-community', '<p><a href="https://2.bp.blogspot.com/-x7Omx4GipXs/TW0EwF8amNI/AAAAAAAAAMU/t1xKDMRjvuE/s1600/Time%2BOut%2BClub%2Bfor%2BParents%2Bin%2BLimerick.jpg"><img decoding="async" src="https://2.bp.blogspot.com/-x7Omx4GipXs/TW0EwF8amNI/AAAAAAAAAMU/t1xKDMRjvuE/s200/Time%2BOut%2BClub%2Bfor%2BParents%2Bin%2BLimerick.jpg" border="0" alt="" /></a><span  ><span>If you&#8217;re a community worker wrecking your head over how to get people involved in activities, </span><a href="https://changingireland.ie/%20ISSUE35-SCRUM%20OVER!.pdf"><span>check out page 13 of the latest issue</span></a><span> as well as the following:</span><br /></span></p>
<p><span ><i><b><span  ><a href="https://changingireland.ie/ISSUE35-SCRUM%20OVER!.pdf" rel="nofollow noopener noreferrer" target="_blank"></a></span>[ED&#8217;S NOTE &#8211; THIS REPORT HERE IS ADDITIONAL TO THE COVERAGE IN OUR LATEST PRINT EDITION ABOUT A PILOT PROJECT FOR PARENTS IN LIMERICK].</b></i></span></p>
<p><span  ></span></p>
<p><span ><a href="https://changingireland.ie/ISSUE35-SCRUM%20OVER!.pdf" rel="nofollow noopener noreferrer" target="_blank"></a></span><b><span >A “youth club for grown-ups”  </span></b></p>
<p><b><span >&#8211; a volunteer/participant view</span></b></p>
<p>Helen Ring is a local parent and community volunteer with the Time Out Club in Our Lady of Lourdes/Weston, a successful pilot scheme that that could be copied by any community (there’s a template available).</p>
<p><span lang="EN-GB"><span >She told &#8216;Changing Ireland&#8217;:</span></span></p>
<p><span lang="EN-GB"><span >&#8211; The group named the project themselves.</span></span></p>
<p><span lang="EN-GB"><span >&#8211; They decide at the beginning what activities they’d like to do.</span></span></p>
<p><span lang="EN-GB"><span >&#8211; The age-range is from 20-57 and the door is open to anyone.</span></span></p>
<p><span lang="EN-GB"><span >&#8211; It really develops your confidence.</span></span></p>
<p><span lang="EN-GB"><span >&#8211; It’s the only new group to form in recent times in our community.</span></span></p>
<p><span lang="EN-GB"><span >&#8211; The participants don’t pay for anything.</span></span></p>
<p>“There are 17 in the group now and we find it great, relaxing, a way of getting out of the house,&#8221; said Helen. &#8220;It’s especially important now with the recession to get a break, it’s time out for ourselves and it’s whatever we want to do that counts.”</p>
<p><span lang="EN-GB"><span >“Everything we do now is a one-off and we’re always trying something new, every week – anything from hairdressing lessons to canvas printing to guest-talks &#8211; it’s a youth club for grown ups,” said Helen.</span></span></p>
<p><span lang="EN-GB"><span >One of the more unusual things the women learned how to do was to make small rocking-chairs for children.</span></span></p>
<p><span lang="EN-GB"><span >They’ve also had a child-expert in to run a course called ‘Cool Talking’ which has done wonders for relations between mothers and their teenagers: “I’ve two teenage girls and an 11-year-old son and an older son who’s getting married soon.</span></span></p>
<p><span lang="EN-GB"><span >“Now I’ve learned to listen and talk rather than going in screaming! One woman says her son has become tidier because of her doing that course and we’ve all become better listeners. I’d recommend this course even for young parents.”</span></span></p>
<p><span lang="EN-GB"><span > “Every community should have a time-out club for its women. Just try it!”</span></span></p>
<p><span lang="EN-GB"><span >Helen does so much volunteering that her neighbours think she’s got a paid job. An example of one small thing she does is  every Tuesday she sends out a reminder text to parents about the Time Out Club. Small things matter!</span></span></p>
<p><b><span lang="EN-GB" ><span ><a href="https://changingireland.ie/ISSUE35-SCRUM%20OVER!.pdf">See further coverage on page 13 of our Spring 2011 issue (click here!).</a></span><span><o:p></o:p></span></span></b></p>
<p><span ><b><i>CAPTION: <span>Time Out Club members.</span></i></b></span></p>
<p>  </p>', 'If you’re a community worker wrecking your head over how to get people involved in activities, check out page 13 of the latest issue as well as the following: . A “youth', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 310, 1, '2011-03-01T14:35:00Z', '2019-09-13T10:56:43Z', '2011-03-01T14:35:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('WHAT NOW FOR CLAIMING OUR FUTURE, 2ND REPUBLIC, ETC?', 'what-now-for-claiming-our-future-2nd-republic-etc', '<p>&nbsp;</p>
<h3><span>Gearoid Fitzgibbon asks what the many groups seeking political reform will do now the election is over.<br />
The article (on page 12) is published in the latest edition of Changing Ireland OUT NOW:<br />
</span><a href="https://changingireland.ie/ISSUE35-SCRUM%20OVER!.pdf" target="_blank" rel="nofollow noopener noreferrer"><span>www.changingireland.ie/ISSUE35-SCRUM%20O<wbr /></span><span>VER!.pdf</span></a></h3>
<p>&nbsp;</p>', 'Gearoid Fitzgibbon asks what the many groups seeking political reform will do now the election is over. The article (on page 12) is published in the latest edition of Changing Ireland OUT NOW: www.changingireland.ie/ISSUE35-SCRUM%20OVER!.pdf', 'https://changingireland.ie/wp-content/uploads/2011/03/Picture-4.png', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 311, 1, '2011-03-01T13:32:00Z', '2019-09-13T10:56:52Z', '2011-03-01T13:32:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('(untitled 312)', '312', '<p><a href="https://2.bp.blogspot.com/-Fz5cY2bEQ4U/TWvLa96VsXI/AAAAAAAAAL8/XcVD38XFLRs/s1600/Iss35cover.gif"><img decoding="async" src="https://2.bp.blogspot.com/-Fz5cY2bEQ4U/TWvLa96VsXI/AAAAAAAAAL8/XcVD38XFLRs/s400/Iss35cover.gif" alt="" border="0" /></a><span lang="EN-GB"><b>The </b><a href="https://changingireland.ie/ISSUE35-SCRUM%20OVER!.pdf"><b>SPRING EDITION of &#8216;Changing Ireland&#8217; has just been published online</b><i> (click here for a pdf)</i></a><b>! </b></span><b>The print version will be out later this week. </b></p>
<p><b>Inside, we&#8217;ve 24 pages of coverage on:</b></p>
<p>&nbsp;</p>
<ul>
<li></li>
<li></li>
<li></li>
<li></li>
<li></li>
<li></li>
<li></li>
<li></li>
<li></li>
<li></li>
<li></li>
<li>5000 TÚS &#8216;JOBS&#8217; on the way nationwide through the LCDP</li>
<li>FINE GAEL PLANS for communities</li>
<li>ANTI-RACISM update</li>
<li>MEDIATION saves lives and money (in Mayo)</li>
<li>PILOT delivers (for parents)</li>
<li>VOLUNTEER interview (Patsy Cronin)</li>
<li>COMMUNITY RESILIENCE training (Editor&#8217;s recommended top read on page 23)</li>
<li>PARTY promises &#8211; 5 pages <a href="https://www.highendreplicawatches.com/product/rolex-day-date-40mm-mens-m228236-0012-stainless-steel-president-bracelet/">rolex day date 40mm mens m228236 0012 stainless steel president bracelet</a> on what the parties promised communities</li>
<li>News report: GARDA cuts crime by texting</li>
<li>COMMUNITY Services Programme profiled</li>
<li>HORACE &#8211; EXCEPTIONALLY GOOD NEWS FOR IRELAND!</li>
</ul>
<p>&nbsp;</p>
<p></p>
<p></p>', 'The SPRING EDITION of ‘Changing Ireland’ has just been published online (click here for a pdf)! The print version will be out later this week. Inside, we’ve 24 pages of coverage on:', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 312, 1, '2011-02-28T16:17:00Z', '2023-12-15T01:18:07Z', '2011-02-28T16:17:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('WHAT DO THE PARTIES SAY ABOUT COMMUNITIES?', 'what-do-the-parties-say-about-communities', '<p><a href="https://2.bp.blogspot.com/-MwGsqbQd1V8/TWYQ07vCZiI/AAAAAAAAAL0/Th9JBxUTgtk/s1600/Unknown-1.jpeg"><img decoding="async" src="https://2.bp.blogspot.com/-MwGsqbQd1V8/TWYQ07vCZiI/AAAAAAAAAL0/Th9JBxUTgtk/s320/Unknown-1.jpeg" border="0" alt="" /></a><span><br /></span><span ><span>FIND OUT NOW!</span></span></p>
<div><span ><span>&#8211; with our handy guide researched by reporter Rachel Finucanne.</span></span></div>
<div><span ><span>Just click the link:<br /></span><a href="https://docs.google.com/document/d/11yn8a8JQybKeRyEZLuVViRijEAEp_CedRiE4gfolGtg/edit?hl=en"><span>https://docs.google.com/docume<wbr></span></a><span></span><a href="https://docs.google.com/document/d/11yn8a8JQybKeRyEZLuVViRijEAEp_CedRiE4gfolGtg/edit?hl=en"><span>nt/d/11yn8a8JQybKeRyEZLuVViRij<wbr></span></a><span></span><a href="https://docs.google.com/document/d/11yn8a8JQybKeRyEZLuVViRijEAEp_CedRiE4gfolGtg/edit?hl=en"><span>EAEp_CedRiE4gfolGtg/edit?hl=en</span></a></span></div>', 'FIND OUT NOW! – with our handy guide researched by reporter Rachel Finucanne. Just click the link:https://docs.google.com/document/d/11yn8a8JQybKeRyEZLuVViRijEAEp_CedRiE4gfolGtg/edit?hl=en', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 313, 1, '2011-02-24T08:02:00Z', '2011-02-24T08:02:00Z', '2011-02-24T08:02:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('Jesse Jackson in Ireland', 'jesse-jackson-in-ireland', '<p><a href="https://4.bp.blogspot.com/-wjv1nRveFqc/TVqNa7SQIuI/AAAAAAAAALs/OEMnbus_G18/s1600/photo-774634.JPG"><img decoding="async" src="https://4.bp.blogspot.com/-wjv1nRveFqc/TVqNa7SQIuI/AAAAAAAAALs/OEMnbus_G18/s320/photo-774634.JPG" border="0" alt="" /></a></p>
<p>&#8220;You may not be responsible for being down, but you must be responsible for getting up. Don&#8217;t let anything break your spirit. Forward ever, backward never,&#8221; said Jesse Jackson.</p>
<div>He was in Dublin on Sunday to launch a new plan drawn up by the Equality and Rights Alliance which has 160 member organisations including &#8216;Changing Ireland&#8217;.</div>
<div>The plan is now available for download from their website: <a href="https://www.eracampaign.org/">www.eracampaign.org</a></div>', '“You may not be responsible for being down, but you must be responsible for getting up. Don’t let anything break your spirit. Forward ever, backward never,” said Jesse Jackson. He was in Dublin on Sunday to launch a new plan drawn up by the Equality and Rights Alliance which has 160 member organisations including ‘Changing', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 314, 1, '2011-02-15T14:26:00Z', '2019-09-13T10:57:05Z', '2011-02-15T14:26:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('New Resource: National Programme Contacts Database', 'new-resource-national-programme-contacts-database', '<p><a href="https://2.bp.blogspot.com/-2kTuOSg-ijY/TVVvnQf52NI/AAAAAAAAALc/eoZyPya3KV0/s1600/Screenshot%2Bof%2BLCDP%2Bcontacts%2Bdatabase.png"><img decoding="async" src="https://2.bp.blogspot.com/-2kTuOSg-ijY/TVVvnQf52NI/AAAAAAAAALc/eoZyPya3KV0/s320/Screenshot%2Bof%2BLCDP%2Bcontacts%2Bdatabase.png" border="0" alt="" /></a></p>
<p><span><span >We&#8217;ve compiled a contacts database of staff throughout the Local and Community Development Programme and </span><a href="https://spreadsheets.google.com/ccc?key=0Ag2kPUIQq1MbdDBHeWdLV3RnSGxXbFdqY04xekRkQmc&amp;hl=en#gid=0"><span >it’s ALL HERE (meaning if you click here you&#8217;ll download the full Excel document):</span></a><span > <o:p></o:p></span></span></p>
<p><span><span >If you&#8217;re looking to contact all the rural social scheme staff in the Programme, this should help. It doesn’t matter who you’re looking for – we’ve them all listed: LCDP staff working with YOUTH, JOBS CLUBS, MEDIATION, FINANCE, ETC. You’ll find them here on our database. <o:p></o:p></span></span></p>
<p><span><span >Note: The database is 85% complete – if your Local Development Company’s listing is incomplete </span><a href="https://docs0.google.com/document/d/1vCJmUf1bWVYx6ORWlbB1bVQ-yeBWZVxAx1lBirguHJc/edit?hl=en#)"><span >please fill out this form and return it to us! </span></a><span ><o:p></o:p></span></span></p>
<p><span><span >&#8211; Allen Meagher, editor/manager, ‘Changing Ireland’.</span></span></p>
<p>  </p>', 'We’ve compiled a contacts database of staff throughout the Local and Community Development Programme and it’s ALL HERE (meaning if you click here you’ll download the full Excel document): If you’re looking to contact all the rural social scheme staff in the Programme, this should help. It doesn’t matter who you’re looking for – we’ve', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 315, 1, '2011-02-04T18:05:00Z', '2011-02-04T18:05:00Z', '2011-02-04T18:05:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('COMMUNITY GROUPS ASKED TO CHECK ON HOUSEBOUND RESIDENTS', 'community-groups-asked-to-check-on-housebound-residents', '<p><img decoding="async" src="https://4.bp.blogspot.com/_cgq3tUEQMDo/TPz19pd7MiI/AAAAAAAAAK0/UHVwBQpEoGE/s320/Picture%2B11.png" border="0" alt="" /><span><span ><span ><b><a href="https://4.bp.blogspot.com/_cgq3tUEQMDo/TPz19pd7MiI/AAAAAAAAAK0/UHVwBQpEoGE/s1600/Picture%2B11.png"><span >What has your community project been doing for people isolated in the snow and bad weather?</span></a><span > Have you any ideas to share?</span></b></span></span></span></p>
<p><span><span ><span >Last week, the Community Minister wrote to hundreds of community groups funded through the Local and Community Development Programme urging them to &#8220;keep in regular contact with people who may find themselves housebound to ensure that they have sufficient supplies of food and heat etc.&#8221;<o:p></o:p></span></span></span></p>
<p><span><span ><span >Minister for Community, Equality and Gaeltacht Affairs Pat Carey said &#8220;if other interventions are required, the relevant local statutory agency e.g. the HSE should be contacted immediately so that the necessary help and assistance can be obtained.&#8221;<o:p></o:p></span></span></span></p>
<p><span><span ><span >A lot of groups would already have been helping out in various ways, as projects did in Cork during the floods and subsequent water shortages last year.</span></span></span></p>
<p><span><span ><span >Minister Carey in his letter described the assistance by community groups as &#8220;invaluable&#8221; and said the community sector is &#8220;uniquely placed&#8221; to help out.</span></span></span></p>
<p><span><span ><span >The media only pick up on weather-related deaths on the roads, but who knows how many people have died quietly in their homes from the cold or related illnesses this year.</span></span></span></p>
<p><span><span ><span ><b>Let us know if you&#8217;ve ideas for helping people out that other community groups could emulate or copy!</b></span></span></span></p>
<p><span><span ><span ><b>Email: editor@changingireland.ie or comment below here.</b></span></span></span></p>
<p>  </p>', 'What has your community project been doing for people isolated in the snow and bad weather? Have you any ideas to share? Last week, the Community Minister wrote to hundreds of community groups funded through the Local and Community Development Programme urging them to “keep in regular contact with people who may find themselves housebound', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 316, 1, '2010-12-06T14:38:00Z', '2010-12-06T14:38:00Z', '2010-12-06T14:38:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('11 BENEFITS TO YOUNG PEOPLE FROM LEARNING MUSIC', '11-benefits-to-young-people-from-learning-music', '<p><span><span ><br /></span></span><a href="https://3.bp.blogspot.com/_cgq3tUEQMDo/TPnz-YkSXpI/AAAAAAAAAKk/8_ggyAnfF-Y/s1600/ISS%2B34-BALLYMUN%2BYOUNG%2BMUSICIANS%2Bbest.jpg"><img decoding="async" src="https://3.bp.blogspot.com/_cgq3tUEQMDo/TPnz-YkSXpI/AAAAAAAAAKk/8_ggyAnfF-Y/s200/ISS%2B34-BALLYMUN%2BYOUNG%2BMUSICIANS%2Bbest.jpg" border="0" alt="" /></a><span><span ><br /></span></span><span  ></p>
<h3 ft="{&quot;type&quot;:&quot;msg&quot;}" ><span><span><span >11 BENEFITS TO YOUNG PEOPLE</span></span></span></h3>
<h3 ft="{&quot;type&quot;:&quot;msg&quot;}" ><span><span><span >FROM LEARNING MUSIC &#8211; THE BALLUMUN EXPERIENCE<br />Children who play a musical instrument in a band develop improved:</span></span></span></h3>
<h3 ft="{&quot;type&quot;:&quot;msg&quot;}" ><span><span><span >&#8211; Ability to Focus- Patience- Self Confidence- Abilities to relax- Hand co-ordination- Discipline- Ability to learn languages- They find a means of self-expression. &#8211; They have fun.- They make new friends.-</span></span><span><span><span >They experience achievement.</p>
<p>For more, read our feature on the Ballymun Music Programme which has seen over 1000 children learn music on page 21:</span></span><a href="https://changingireland.ie/ISSUE34.pdf"><span><span >https://changingireland.ie/ISSUE34.pd<wbr></span></span></a><span></span><a href="https://changingireland.ie/ISSUE34.pdf"><span><span >f</span></span></a></span></span></h3>
<h3 ft="{&quot;type&quot;:&quot;msg&quot;}" ><span><span><img decoding="async" src="https://2.bp.blogspot.com/_cgq3tUEQMDo/TPnz-jPom-I/AAAAAAAAAKs/iTBfXBZ4IQ8/s200/ISS%2B34-Ron%2BCooney.jpg" border="0" alt="" /><i><span><span >PHOTOS: </span></span></i></span></span></h3>
<h3 ft="{&quot;type&quot;:&quot;msg&quot;}" ><span><span><i><span><span >(1) </span></span></i></span></span><i><span><span >Young musicians from the Ballymun Music Programme</span></span></i><span><span><i><span><span > </span></span></i></span></span></h3>
<h3 ft="{&quot;type&quot;:&quot;msg&quot;}" ><span><span><i><span><span >(2) </span></span></i></span></span><i><span><span >Ron Cooney, Ballymun Music Programme director</span></span></i></h3>
<h3 ft="{&quot;type&quot;:&quot;msg&quot;}" ><span><span><span ><br /></span></span></span></h3>
<p></span></p>', '11 BENEFITS TO YOUNG PEOPLE FROM LEARNING MUSIC – THE BALLUMUN EXPERIENCEChildren who play a musical instrument in a band develop improved: – Ability to Focus- Patience- Self Confidence- Abilities to relax- Hand co-ordination- Discipline- Ability to learn languages- They find a means of self-expression. – They have fun.- They make new friends.-They experience achievement.', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 317, 1, '2010-12-04T07:54:00Z', '2010-12-04T07:54:00Z', '2010-12-04T07:54:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('WINTER EDITION OUT NOW! HERE!', 'winter-edition-out-now-here', '<div><span ><span >You can now view and download </span><span ><a href="https://docs.google.com/viewer?a=v&amp;pid=explorer&amp;chrome=true&amp;srcid=0Bw2kPUIQq1MbYjE3MTkyN2ItMjBiZi00OWQ0LWEyNDItYmNjMGZiMjZmMDQx&amp;hl=en">our latest magazine, the Winter 2010 edition, by clicking here.</a></span></span></div>
<p><span><span >THE PRINT VERSION WILL BE DELIVERED TO EASON NEWSAGENTS AND TO ADDRESSES NATIONWIDE NEXT WEEK!</span></span></p>
<p><span   ><span ><img decoding="async" src="https://1.bp.blogspot.com/_cgq3tUEQMDo/TPZbQ3xFhoI/AAAAAAAAAKc/VJykGSOeJFg/s400/Changing%2BIreland%2BWinter%2B2008%2BCOVER.png" border="0" alt="" /></span></span></p>
<p>  </p>', 'You can now view and download our latest magazine, the Winter 2010 edition, by clicking here. THE PRINT VERSION WILL BE DELIVERED TO EASON NEWSAGENTS AND TO ADDRESSES NATIONWIDE NEXT WEEK!', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 318, 1, '2010-12-01T14:24:00Z', '2010-12-01T14:24:00Z', '2010-12-01T14:24:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('PHOTO-REPORT from ICTU’s mass rally in Dublin, Nov 27', 'photo-report-from-ictus-mass-rally-in-dublin-nov-27', '<p><a href="https://3.bp.blogspot.com/_cgq3tUEQMDo/TPP5CKlxU0I/AAAAAAAAAKU/ZwkXgy3kILA/s1600/DSCF8002.JPG"><span ><span ><img decoding="async" src="https://3.bp.blogspot.com/_cgq3tUEQMDo/TPP5CKlxU0I/AAAAAAAAAKU/ZwkXgy3kILA/s320/DSCF8002.JPG" border="0" alt="" /></span></span></a><span ><span ><br /></span></span><a href="https://2.bp.blogspot.com/_cgq3tUEQMDo/TPP4v3OtYnI/AAAAAAAAAKM/3pDPWDQX_2Q/s1600/DSCF8068.JPG"><img decoding="async" src="https://2.bp.blogspot.com/_cgq3tUEQMDo/TPP4v3OtYnI/AAAAAAAAAKM/3pDPWDQX_2Q/s320/DSCF8068.JPG" border="0" alt="" /></a><span ><span ><br />We&#8217;ve posted </span></span><a href="https://www.facebook.com/album.php?aid=262701&amp;id=195484689356&amp;ref=mf"><span ><span >photos from the mass rally outside the GPO on Saturday</span></span></a><span ><span > on our Facebook page.</span></span></p>
<div><span ><span >For the record, our estimate of the numbers who took part are: 70,000 people on O&#8217;Connell Street and approx 100,000 who took part at one point or another in the march. </span></span></div>
<div><span ><span >The speeches included powerful and well-received contributions from Siobhan O&#8217;Donoghue, Fintan O&#8217;Toole and Christy Moore among others. </span></span></div>
<div><span ><span >Christy sang a song for Joe McNamara, about the only person who faces charges due to the banking crisis &#8211; he was the man who parked up his cement mixer outside the Dail when it returned after the summer recess.</span></span></div>
<div><span ><span ><br /></span></span></div>
<div><i><span ><span >Captions: </span></span></i></div>
<div><i><span ><span >Top image: Fintan O&#8217;Toole addresses the rally outside the GPO.</span></span></i></div>
<div><i><span ><span >Lower image: Minimum wage cut protesters call for the return of the Irish pound.</span></span></i></div>
<div><i><span ><span >Photos copyleft &#8216;Changing Ireland&#8217;: &#8211; meaning you can use the photos but you must name the source.</span></span></i></div>
<div><span ><span ><br /></span></span></div>
<div></div>', 'We’ve posted photos from the mass rally outside the GPO on Saturday on our Facebook page. For the record, our estimate of the numbers who took part are: 70,000 people on O’Connell Street and approx 100,000 who took part at one point or another in the march. The speeches included powerful and well-received contributions from', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 319, 1, '2010-11-29T18:55:00Z', '2010-11-29T18:55:00Z', '2010-11-29T18:55:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('Minister Carey’s comments on the budget and 10% cut to Dept funding', 'minister-careys-comments-on-the-budget-and-10-cut-to-dept-funding', '<p><span lang="EN-GB"><span ><span >The overall reduction in the Department of Community, Equality and Gaeltacht Affairs budget for 2011 will be of the order of 10%.</span></span></span></p>
<p>  <span ><span >   For more information on the budget cuts, click here for </span></span><a href="https://docs.google.com/viewer?a=v&amp;pid=explorer&amp;chrome=true&amp;srcid=0Bw2kPUIQq1MbMWFhOGI4NGEtOWE0Yy00MjZkLWE0NzgtNWI5YmY5YzQxZmIz&amp;hl=en"><span ><span >Minister Pat Carey&#8217;s statement on the four-year plan.</span></span></a></p>
<div><span ><span ><br /></span></span></div>
<div><span ><span >This is what he had to say about funding under the following sub-head:</span></span></div>
<div>  </p>
<p><b><i><span lang="EN-GB"><span ><span >Developing Communities</span></span></span></i></b></p>
<p><span lang="EN-GB"><span ><span >&#8220;There will continue to be an emphasis on the prioritisation of front-line services and supports to customers and beneficiaries at the expense of administration, overheads and ancillary costs.&#8221;</span></span></span></p>
<p><span lang="EN-GB"><o:p><span ><span ></span></span></o:p></span><span ><span >&#8220;My Department will shortly commence a structured dialogue with the Community &amp; Voluntary Sector with the aim of ensuring that the impact of any budgetary adjustments to the services provided by the Sector are minimised, as far as possible.</span></span><span ><span >  </span></span><span ><span >To this end, my Department will be working with the sector to achieve greater consolidation, coordination and efficiencies among service providers.&#8221;</span></span></p>
<p><span ><span ><b>For more download the document via the link (above in the text).</b></span></span></p>
<p><span ><b><i><span >DAIL DEBATE ON STATUS OF CDPs (Nov 3rd)</span></i></b></span></p>
<p><span ><b><span ><span ></span></span></b></span></p>
<p><span ><span ><b></p>
<div>A Dail debate on the <a href="https://debates.oireachtas.ie/dail/2010/11/03/00018.asp">&#8220;Status of Community Development Projects&#8217; (click here for the report)</a> took place on November 3rd, in the run-up to the budget. </div>
<div></div>
<div><span>In the debate, Minister Pat Carey responded to questions  from Fine Gael TD Paul Connaughton, FG&#8217;s Frank Feighan and Labour&#8217;s Jack Wall and the Minister indicated that staff in CDPs should not fear losing their jobs, that the focus was on frontline services. He said the Local and Community Development Programme would &#8220;enhance&#8221; community development activity across the State and argued that it would not lead to a reduction in such activity. </span></div>
<div></div>
<div>For more information on &#8216;Where CDPs now stand&#8217; read<a href="https://changingireland.blogspot.com/2010/11/where-cdps-now-stand.html"> our blog posting from last week.</a></div>
<p></b></span></span></p>
<p>     </div>', 'The overall reduction in the Department of Community, Equality and Gaeltacht Affairs budget for 2011 will be of the order of 10%. For more information on the budget cuts, click here for Minister Pat Carey’s statement on the four-year plan. This is what he had to say about funding under the following sub-head: Developing Communities', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 321, 1, '2010-11-26T17:53:00Z', '2019-07-23T12:15:23Z', '2010-11-26T17:53:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('The Local & Community Development Programme (LCDP)', 'the-local-community-development-programme-lcdp', '<p><a href="https://4.bp.blogspot.com/_cgq3tUEQMDo/TO_nY5E3siI/AAAAAAAAAJ8/3MW6M-bfp5s/s1600/LCDP%2Blogo.jpg"><img decoding="async" src="https://4.bp.blogspot.com/_cgq3tUEQMDo/TO_nY5E3siI/AAAAAAAAAJ8/3MW6M-bfp5s/s200/LCDP%2Blogo.jpg" alt="" border="0" /></a><b></b></p>
<p><span lang="EN-GB"><span><span>The Local &amp; Community Development Programme (LCDP) is managed by POBAL on behalf of the Department of Community, Equality and Gaeltacht Affairs. It forms part of the National Development Plan 2007 -2013.</span></span></span></p>
<div>
<p>&nbsp;</p>
<p><span lang="EN-GB"><span><span>The Programme is an amalgamation of two former programmes, Local Development Social Inclusion Programme and the Community Development Programme.</span></span></span></p>
<p>&nbsp;</p>
</div>
<div>
<p><span lang="EN-GB"><span><span>AIM: The LCDP aims to tackle poverty and social exclusion through partnership between Government and people in the most disadvantaged communities.</span></span></span></p>
<p>&nbsp;</p>
</div>
<div>
<p><span lang="EN-GB"><span><span>PROGRAMME GOALS: There are four key goals under LCDP.</span></span></span></p>
<ul>
<li>
<p><span lang="EN-GB"><span><span>GOAL 1: Promote awareness, knowledge and uptake of a wide range of statutory, voluntary and community services;</span></span></span></p>
</li>
<li>
<p><span lang="EN-GB"><span><span>GOAL 2: Increase access to formal and informal educational, recreational and cultural activities and resources</span></span></span></p>
</li>
<li>
<p><span lang="EN-GB"><span><span>GOAL 3: Increase in people’s work readiness and employment prospects</span></span></span></p>
</li>
<li>
<p><span lang="EN-GB"><span><span>GOAL 4: Promote engagement with policy, practice, and decision-making processes on matters affecting local communities</span></span></span></p>
</li>
</ul>
<p><span lang="EN-GB"><span><span>‘Changing Ireland’/</span></span><a href="https://changingireland.ie/"><span><span>www.changingireland.ie</span></span></a><span><span> is the national magazine for the Programme. It is setting up as an independent company, having for the past 9 years being managed by the voluntary board of management of the CDN Moyross Ltd.</span></span></span></p>
<p>&nbsp;</p>
<p><span lang="EN-GB"><span><span>We will shortly be publishing a map showing the distribution of companies nationwide within the Programme.</span></span></span></p>
<p>&nbsp;</p>
<p><span lang="EN-GB"><span><span><span>For more on CDPs and their place within the Programme, check </span></span></span><a href="https://changingireland.blogspot.com/2010/11/where-cdps-now-stand.html"><span><span><span>our earlier blog entry.</span><br />
</span></span></a></span></p>
<p>&nbsp;</p>
<table cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td><span><b><span><span><span><span><span><span><span> </span></span></span></span></span></span></span></b></span></td>
<td></td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
</div>', 'The Local & Community Development Programme (LCDP) is managed by POBAL on behalf of the Department of Community, Equality and Gaeltacht Affairs. It forms part of the National Development Plan 2007 -2013. The Programme is an amalgamation of two former programmes, Local Development Social Inclusion Programme and the Community Development Programme. AIM: The', 'https://changingireland.ie/wp-content/uploads/2017/06/Iss-2B57-2Brural-2Bbldgs-2Btony-2Bgrehan.jpg', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 322, 1, '2010-11-26T16:55:00Z', '2019-07-23T12:17:01Z', '2010-11-26T16:55:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);
INSERT INTO posts (title, slug, content, excerpt, image_url, image_alt, categories, tags, author, wp_id, published, created_at, updated_at, published_at)
VALUES ('HUNDREDS OF BUSINESS STARTS AND JOBS YOU DON’T KNOW ABOUT', 'hundreds-of-business-starts-and-jobs-you-dont-know-about', '<p><span ><span >Thousands of people have been directly helped to set up in business or find suitable work since the start of this year, through the Local and Community Development Programme.</span></span></p>
<p><img decoding="async" src="https://2.bp.blogspot.com/_cgq3tUEQMDo/TO7ugCClxLI/AAAAAAAAAJs/xBBMCqCvKdE/s200/DLDC%2Blogo.jpg" border="0" alt="" /></p>
<p><span ><span >For instance, Donegal Local Development Company directly supported over 153 small family businesses to open up in the first 11 months of this year. That compares with 146 people who directly set up in small businesses upon finishing a course run by the Northside Partnership in Dublin.</span></span></p>
<p><span ><span >Some companies focused on supporting people on the margins, for instance long-term unemployed people with mental health challenges, to better prepare for and find suitable work.</span></span></p>
<p><span ><span >In our upcoming print edition, we have short reports from Cork, Dublin, Galway, Donegal and Laois showing how Local Development Companies are slowly but steadily getting people into business or helping them find suitable work. The courses and local programmes on offer are giving people opportunities they didn&#8217;t have before.</span></span></p>
<p><span ><span ></span></span><span ><span >These are jobs you don&#8217;t hear about in IDA announcements, because </span></span><span ><span >they come about through the work of Local Development Companies, </span></span><span ><span >they usually involve the establishment of small or family businesses, and they&#8217;re emerging one-by-one around the country. </span></span></p>
<p><span ><span >Our reports indicate that thousands of people are benefitting and by that we mean finding work. The full tally should emerge in time through data-collection systems operating within the Programme. </span></span></p>
<p><span ><span >&#8211; Allen Meagher, Editor</span></span><span><o:p></o:p></span></p>
<p>  </p>', 'Thousands of people have been directly helped to set up in business or find suitable work since the start of this year, through the Local and Community Development Programme. For instance, Donegal Local Development Company directly supported over 153 small family businesses to open up in the first 11 months of this year. That compares', '', '', '[{"slug":"uncategorized","title":"Uncategorized"}]', '[]', '', 323, 1, '2010-11-25T22:57:00Z', '2019-07-23T12:18:10Z', '2010-11-25T22:57:00Z')
ON CONFLICT(wp_id) DO UPDATE SET
  title = excluded.title, slug = excluded.slug, content = excluded.content,
  excerpt = excluded.excerpt, image_url = excluded.image_url, image_alt = excluded.image_alt,
  categories = excluded.categories, tags = excluded.tags, author = excluded.author,
  published = excluded.published, updated_at = excluded.updated_at,
  published_at = COALESCE(posts.published_at, excluded.published_at);