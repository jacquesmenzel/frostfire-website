#!/usr/bin/env python3
"""Build the homeowner troubleshooting guides under /guides/.

Each guide answers one real homeowner question ("my heater's not working, what
can I check?") in Jax's voice, with a safety box, a numbered checklist, when to
call a pro, an FAQ and a soft Frost Fire call-to-action. Re-run after editing
the GUIDES content below (idempotent):

    python3 scripts/build-guides.py && python3 scripts/normalize-urls.py
"""

from __future__ import annotations

import html
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "guides"
SITE = "https://frostfirehvacr.com"
UPDATED = "2026-10-20"
UPDATED_LABEL = "October 20, 2026"
PHONE_TEL = "+19192304439"
PHONE = "(919) 230-4439"

# Reuse the service-page look (same tokens, header, footer, fonts).
SERVICE_TEMPLATE = (ROOT / "services" / "heating-repair.html").read_text(encoding="utf-8")
BASE_CSS = SERVICE_TEMPLATE.split("<style>", 1)[1].split("</style>", 1)[0].strip()

GUIDE_CSS = """
.guide-wrap{max-width:780px;margin:0 auto;padding:56px 24px 24px}
.guide-wrap p,.guide-wrap li{font-size:1.06rem;line-height:1.75}
.guide-wrap p{margin-bottom:16px}
.guide-wrap h2{font-size:clamp(1.5rem,3vw,2rem);margin:40px 0 14px}
.guide-wrap h3{font-size:1.2rem;margin:0 0 6px;font-family:'Inter',sans-serif;color:var(--primary)}
.guide-meta{display:flex;flex-wrap:wrap;gap:6px 16px;color:var(--text-light);font-size:.92rem;margin-bottom:24px}
.safety-box{background:#fff4ef;border:2px solid var(--accent);border-radius:var(--radius);padding:20px 22px;margin:8px 0 28px}
.safety-box h2{margin:0 0 10px;font-size:1.25rem;color:var(--accent)}
.safety-box ul{margin:0;padding-left:20px;display:grid;gap:6px}
.safety-box li{font-size:1rem}
.checklist{list-style:none;padding:0;margin:0;display:grid;gap:14px;counter-reset:c}
.checklist>li{counter-increment:c;position:relative;background:var(--off-white);border:1px solid var(--gray-200);border-radius:var(--radius-sm);padding:16px 18px 16px 62px}
.checklist>li::before{content:counter(c);position:absolute;left:16px;top:14px;width:32px;height:32px;border-radius:50%;background:var(--primary);color:#fff;font:800 1rem/32px 'Montserrat',sans-serif;text-align:center}
.checklist p{margin:0 0 8px}
.checklist p:last-child{margin-bottom:0}
.fixed-it{color:#1f7a4d;font-weight:600}
.pro-list{padding-left:20px;display:grid;gap:8px}
.cta-box{background:linear-gradient(135deg,var(--primary),var(--dark));color:#fff;border-radius:var(--radius);padding:28px;margin:36px 0;display:grid;gap:12px}
.cta-box h2{color:#fff;margin:0;font-size:1.5rem}
.cta-box p{color:rgba(255,255,255,.88);margin:0}
.cta-box .cta-buttons{justify-content:flex-start}
.cta-box .btn-white{font-size:1rem;padding:14px 26px}
.cta-box .btn-outline{display:inline-flex;align-items:center;gap:8px;padding:14px 26px;border-radius:50px;border:2px solid rgba(255,255,255,.5);color:#fff;text-decoration:none;font-weight:600}
.faq details{border:1px solid var(--gray-200);border-radius:var(--radius-sm);padding:14px 18px;margin-bottom:10px;background:#fff}
.faq summary{cursor:pointer;font-weight:700;color:var(--primary);font-size:1.02rem}
.faq details p{margin:10px 0 0}
.author-box{display:flex;gap:16px;align-items:center;border-top:1px solid var(--gray-200);padding-top:20px;margin-top:36px}
.author-box .avatar{flex:0 0 56px;height:56px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font:800 1.3rem 'Montserrat',sans-serif}
.author-box p{margin:0;font-size:.95rem;color:var(--text-light)}
.author-box strong{color:var(--primary)}
.related-guides{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:12px}
.related-guides a{display:block;padding:14px 16px;border:1px solid var(--gray-200);border-radius:var(--radius-sm);text-decoration:none;color:var(--primary);font-weight:600;background:#fff}
.related-guides a:hover{border-color:var(--ice)}
.service-links{display:flex;flex-wrap:wrap;gap:8px 18px;margin-top:8px}
.service-links a{color:var(--accent);font-weight:600}
.guide-index{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;margin-top:24px}
.guide-card{display:grid;gap:8px;padding:22px;border:1px solid var(--gray-200);border-radius:var(--radius);background:#fff;text-decoration:none;color:var(--text)}
.guide-card:hover{border-color:var(--ice);box-shadow:var(--shadow-lg)}
.guide-card h2{font-size:1.15rem;margin:0;font-family:'Inter',sans-serif}
.guide-card p{margin:0;font-size:.95rem;color:var(--text-light)}
.guide-card .tag{font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:var(--accent);font-weight:700}
"""

SAFETY_DEFAULT = [
    "<strong>Smell gas (rotten eggs)?</strong> Don't touch switches or the thermostat. Get everyone out, then call your gas company or 911 from outside.",
    "<strong>Carbon monoxide alarm going off?</strong> Get everyone outside into fresh air and call 911. Don't go back in to check the furnace.",
    "<strong>Turn the power off</strong> at the furnace or air-handler switch before you open any panel.",
    "<strong>Never bypass a safety switch</strong> (door switch, float switch, pressure switch, limit switch). They shut the system off for a reason.",
]

SERVICE_LINKS = {
    "heating": ("/services/heating-repair", "Heating & furnace repair"),
    "heatpump": ("/services/heat-pump", "Heat pump repair & service"),
    "furnace": ("/services/furnace-installation", "Furnace replacement"),
    "maintenance": ("/services/maintenance", "Maintenance plans"),
    "ac": ("/services/ac-repair", "AC repair"),
    "emergency": ("/services/emergency", "Emergency HVAC service"),
    "thermostat": ("/services/thermostat", "Thermostat service"),
    "iaq": ("/services/indoor-air-quality", "Indoor air quality"),
}


def p(*paras: str) -> str:
    return "".join(f"<p>{x}</p>" for x in paras)


GUIDES = [
    {
        "slug": "heater-not-working",
        "tag": "Heating",
        "title": "Heater Not Working? 10 Things to Check Before You Call",
        "h1": "Heater not working? 10 things to check before you call",
        "desc": "Heat not coming on? A Triangle HVAC tech walks you through 10 safe checks: thermostat, breaker, filter, furnace switch, door switch, drain float switch, error lights and more.",
        "card": "Thermostat, breaker, filter, the furnace switch, error lights. The quick checks that fix a lot of no-heat calls.",
        "howto": True,
        "intro": p(
            "I get a lot of no-heat calls on the first cold night of the year, and a good number of them turn out to be something simple: a thermostat setting, a tripped breaker, a filter so clogged the system shuts itself off. Before you pay anyone to come out, here are the same checks I'd walk you through on the phone.",
            "These steps work for the systems we see most around Raleigh, Durham and the rest of the Triangle: gas furnaces with a separate AC, heat pumps with an air handler in the attic or crawlspace, and all-electric furnaces. Go in order. If one of them fixes it, great. If you get through all ten and still have no heat, that's when you call a pro, and you'll be able to tell them exactly what you already checked.",
        ),
        "steps": [
            ("Check the thermostat mode and setting", p(
                "Make sure it says <strong>Heat</strong> (not Cool, Off or Auto with a cooling setpoint) and that the temperature is set a few degrees above what the room is now. If it's on a schedule, it may be in an \"away\" or overnight setback, so try a temporary hold.",
                "<span class=\"fixed-it\">If the system kicks on within a few minutes, you're done.</span>")),
            ("Replace the thermostat batteries", p(
                "A lot of thermostats run on AA or AAA batteries even when they're wired to the system. A blank screen, a dim screen or a low-battery icon means new batteries first. Smart thermostats that lose power can also lose Wi-Fi and settings, so give it a minute to reconnect.")),
            ("Check the breakers", p(
                "Look for a tripped breaker labeled furnace, air handler, heat pump, AHU or HVAC. A heat pump usually has two: one for the outdoor unit and one for the indoor air handler (which also runs the backup heat strips). Flip a tripped breaker all the way off, then back on, once.",
                "If it trips again right away, leave it off and call. That's an electrical problem, not something to keep resetting.")),
            ("Find the furnace or air-handler switch", p(
                "Near the indoor unit there's usually a switch that looks like a regular light switch. In attics and crawlspaces it's often on the side of the unit or on a nearby rafter. People flip it off by accident all the time, thinking it's a light. Make sure it's <strong>on</strong>.")),
            ("Check the air filter", p(
                "A filter packed with dust chokes the airflow. A furnace will overheat and shut itself off on its high-limit switch, and a heat pump will run but barely warm the house. Pull the filter out and hold it up to a light. If you can't see light through it, replace it. Most homes here need a new 1-inch filter every 1 to 3 months, more with pets.")),
            ("Make sure the blower door is on tight", p(
                "Furnaces and air handlers have a safety switch behind the lower front panel. If that panel isn't seated all the way (maybe after a filter change), the switch stays open and nothing will run. Push the panel firmly into place until it clicks or sits flush.")),
            ("Check the drain pan and float switch", p(
                "High-efficiency gas furnaces and attic air handlers make water, and they drain it through a pipe. If the drain clogs, a float switch in the pan or on the drain line cuts the power to protect your ceiling. Look for standing water in the pan under the unit or a small switch on the drain pipe.",
                "If the pan is full, the drain is clogged. You can shop-vac the drain line from the outside end, but if water is overflowing or the ceiling is stained, call us.")),
            ("Look at the gas supply (gas furnaces)", p(
                "On the gas pipe going into the furnace there's a shutoff valve. The handle should run <strong>parallel</strong> with the pipe (that's open). Also check that other gas appliances like the water heater or stove are working, which tells you gas is reaching the house. Don't try to relight anything if you smell gas.")),
            ("Read the error light", p(
                "Most furnaces and many air handlers have a small blinking light on the control board, visible through a little window in the lower panel. Count the blinks (for example, 3 short flashes, pause, repeat) and write it down or take a video. There's usually a chart on the inside of the door that tells you what it means. See <a href=\"/guides/furnace-heat-pump-error-codes\">how to read your furnace or heat pump error codes</a>.",
                "Don't turn the power off and on before you read it. On many systems that clears the code.")),
            ("Heat pumps: check the outdoor unit", p(
                "If you have a heat pump, look at the outdoor unit. A light coat of frost in cold, damp weather is normal, and the unit will defrost itself every so often (it might steam and go quiet for a few minutes). A solid block of ice, a fan that isn't spinning, or a unit that's silent while the thermostat is calling for heat is not normal. See <a href=\"/guides/heat-pump-frozen-outdoor-unit\">heat pump iced up</a>.",
                "If the thermostat shows <strong>Emergency Heat</strong> or <strong>Aux</strong>, read <a href=\"/guides/emergency-heat-aux-heat\">what emergency heat means</a> before you leave it on.")),
        ],
        "pro": [
            "A breaker trips again right after you reset it.",
            "You smell gas, burning or hot plastic, or see scorch marks.",
            "The furnace tries to start (you hear the inducer fan) but shuts down, or the error light keeps flashing.",
            "Water is overflowing the drain pan or coming through a ceiling.",
            "The heat pump outdoor unit is a solid block of ice or isn't running at all.",
            "You've done all ten checks and still have no heat.",
        ],
        "faqs": [
            ("Why is my furnace running but blowing cold air?", "On a gas furnace, the burners may not be lighting (ignition, flame sensor, gas supply or a pressure switch problem) while the blower keeps running. On a heat pump, the air is naturally cooler than a gas furnace, and it can blow cool for a few minutes during a defrost cycle. If it never warms up, have it checked."),
            ("How long should I wait after changing the thermostat before calling?", "Give it about 5 to 10 minutes. Many systems have a short delay before they start, and gas furnaces run the inducer fan and igniter before the burners light and the blower comes on."),
            ("Is it safe to reset my furnace?", "Turning the switch off and back on once is fine. If it locks out again, stop. Repeatedly resetting a furnace that keeps shutting down can hide a safety problem."),
            ("How much is a service call?", "Frost Fire's diagnostic is $59, and it's waived if you go ahead with the repair. We charge the same on weekends, with no Sunday surcharge."),
        ],
        "related": ["heat-pump-blowing-cold-air", "furnace-turns-on-then-off", "furnace-heat-pump-error-codes"],
        "services": ["heating", "heatpump", "maintenance"],
    },
    {
        "slug": "heat-pump-blowing-cold-air",
        "tag": "Heat pumps",
        "title": "Heat Pump Blowing Cold Air in Winter? What's Normal and What's Not",
        "h1": "Heat pump blowing cold air in winter? What's normal and what's not",
        "desc": "Why your heat pump feels cold, what the defrost cycle is, when aux heat should come on, and the signs your heat pump actually needs repair.",
        "card": "Heat pump air feels cooler than a furnace, and defrost cycles are normal. Here's how to tell normal from broken.",
        "howto": False,
        "intro": p(
            "Heat pumps are everywhere in the Triangle, and the most common question I get about them every winter is some version of \"why is it blowing cold air?\" Sometimes the answer is that nothing is wrong. Sometimes it really does need a repair. Here's how to tell the difference.",
            "First, the big one: a heat pump doesn't make air as hot as a gas furnace. A gas furnace often puts out air well over 100 degrees. A heat pump in cold weather puts out air that's usually somewhere in the 90s at the vent. That's warmer than the room, but it's below your body temperature, so it can feel cool on your hand. If the house is holding temperature, that's the heat pump doing its job.",
        ),
        "steps": [
            ("Feel the air for a full minute, not a few seconds", p(
                "Put your hand at a supply vent near the indoor unit and leave it there. Lukewarm, steady air with the house slowly warming is normal. Air that's the same temperature as the room, or actually cold, while the thermostat is calling for heat is not.")),
            ("Check for a defrost cycle", p(
                "In cold, damp weather, frost builds on the outdoor coil. The heat pump fixes that by briefly running in reverse. During defrost the outdoor fan stops, the unit may hiss or whoosh, and you might see steam rising from it. This usually lasts several minutes and can happen every 30 to 90 minutes when it's cold and wet.",
                "Inside, you may feel cooler air during defrost unless the backup heat comes on to cover it. <span class=\"fixed-it\">If it goes back to warm air after a few minutes, that's normal.</span>")),
            ("Make sure the thermostat is set to Heat and Auto fan", p(
                "If the fan is set to <strong>On</strong> instead of <strong>Auto</strong>, the blower runs all the time, including between heating cycles, and pushes room-temperature air that feels cold. Set the fan to Auto so it only runs while the system is heating.")),
            ("Look at the outdoor unit", p(
                "The outdoor fan should be spinning and the unit humming when the thermostat calls for heat (except during defrost). A light frost is fine. A thick layer of ice covering the coil, ice on top of the unit, or a fan that won't spin means something isn't right. See <a href=\"/guides/heat-pump-frozen-outdoor-unit\">heat pump iced up or frozen</a>.")),
            ("Check the filter and the indoor coil airflow", p(
                "A heat pump needs a lot of airflow. A clogged filter or closed-off vents make it run hot inside the air handler, and some systems will shut down or blow weak, lukewarm air. Change the filter and open the supply vents and returns.")),
            ("Watch what the auxiliary heat does", p(
                "Most heat pumps here have electric heat strips as backup (\"Aux\" on the thermostat). They help on very cold mornings and during defrost. If the thermostat shows Aux for a little while on a cold morning, that's normal. If it shows <strong>Emergency Heat</strong> or Aux runs all day, read <a href=\"/guides/emergency-heat-aux-heat\">what emergency heat means</a>, because that can get expensive.")),
            ("Check both breakers", p(
                "A heat pump usually has one breaker for the outdoor unit and one for the indoor air handler. If the outdoor breaker is tripped, the indoor blower may still run, pushing unheated air (or only running on heat strips). Reset a tripped breaker once. If it trips again, leave it off and call.")),
        ],
        "pro": [
            "The air never gets warmer than the room while the thermostat is calling for heat.",
            "The outdoor unit isn't running, or the fan is stopped while the unit is buzzing.",
            "The outdoor coil stays covered in solid ice through several defrost cycles.",
            "The thermostat runs on Aux or Emergency Heat all the time, or your electric bill jumps.",
            "A breaker keeps tripping.",
        ],
        "faqs": [
            ("Is it normal for my heat pump to blow cool air?", "It's normal for heat pump air to feel cooler than a gas furnace, and for it to blow cooler for a few minutes during defrost. It's not normal for the air to stay at room temperature while the house gets colder."),
            ("Why is there steam coming from my heat pump?", "That's usually the defrost cycle melting frost off the outdoor coil. It looks alarming but it's normal, and it should stop after several minutes."),
            ("Should I switch to emergency heat?", "Only if the heat pump itself has failed and you're waiting on a repair. Emergency heat runs only the electric heat strips, which use much more electricity. Call to get the heat pump fixed rather than running emergency heat for days."),
            ("Do heat pumps work in North Carolina winters?", "Yes. Our winters are mild enough that a properly sized, working heat pump handles most days on its own, with backup heat covering the coldest mornings."),
        ],
        "related": ["heat-pump-frozen-outdoor-unit", "emergency-heat-aux-heat", "heater-not-working"],
        "services": ["heatpump", "heating", "maintenance"],
    },
    {
        "slug": "furnace-turns-on-then-off",
        "tag": "Gas furnaces",
        "title": "Furnace Turns On Then Shuts Off? Common Causes and What You Can Check",
        "h1": "Furnace turns on, then shuts off? Here's what's usually going on",
        "desc": "Short cycling explained: dirty filter, overheating, flame sensor, pressure switch and vent problems. What homeowners can safely check and when to call a tech.",
        "card": "Short cycling is usually airflow, the flame sensor, a pressure switch or the vent. What you can check yourself.",
        "howto": False,
        "intro": p(
            "A furnace that starts, runs for a minute or two, then shuts off (and maybe tries again) is called short cycling. It's one of the most common furnace problems I see, and it's your furnace's safety controls doing their job: something is out of range, so it shuts down instead of running unsafely.",
            "Some causes are things you can fix in five minutes. Others need a technician. Here's how to narrow it down, starting with the easy stuff.",
        ),
        "steps": [
            ("Replace the filter first", p(
                "This is the number one cause. With a clogged filter, heat builds up inside the furnace faster than the blower can move it out, the high-limit switch trips, the burners shut off, and the blower keeps running to cool things down. Then it starts over.",
                "<span class=\"fixed-it\">If a new filter stops the cycling, that was it.</span> Write the date on the new filter so you know when it's due.")),
            ("Open up the vents and returns", p(
                "Closing a lot of supply vents to \"push heat\" to other rooms, or blocking the big return grille with furniture, can cause the same overheating. Open everything up and make sure the return isn't blocked.")),
            ("Check the thermostat location and setting", p(
                "If the thermostat sits right above a supply vent, next to a lamp or in direct sun, it can think the house is warm and shut the furnace off early. A dying thermostat or loose wiring can do it too. Try fresh batteries. If it still shuts off before the house warms up, note that for the tech.")),
            ("Watch the startup sequence", p(
                "A normal gas furnace start goes: the inducer fan (small motor) starts, the igniter glows or sparks, the burners light, and about 30 to 60 seconds later the main blower comes on. Watch through the sight window if you can.",
                "If the burners light and then go out within a few seconds, that often points to a <strong>dirty flame sensor</strong>. It's a common, inexpensive fix, but it means opening the burner compartment, so I recommend letting a tech clean or replace it.")),
            ("Check the vent pipes outside", p(
                "High-efficiency furnaces have two white PVC pipes going outside, one for intake air and one for exhaust. Leaves, a bird or wasp nest, or snow blocking either one will trip the pressure switch and shut the furnace down. Clear anything you can see from the outside ends. Never stick tools far into the exhaust pipe.")),
            ("Check the condensate drain", p(
                "High-efficiency furnaces also drain water through a small hose and trap. A kinked or clogged hose can back water up and trip the pressure switch. If you see water pooling inside the furnace or a sagging, kinked drain hose, that's a likely cause.")),
            ("Read the error code", p(
                "If the furnace has a blinking light, count the flashes before you turn anything off. Codes for pressure switch, flame loss or limit trips tell a tech exactly where to look. See <a href=\"/guides/furnace-heat-pump-error-codes\">how to read furnace error codes</a>.")),
        ],
        "pro": [
            "The burners light and then go out (likely flame sensor or gas pressure).",
            "The error code points to the pressure switch, limit or flame loss, and the filter and vents are fine.",
            "You smell burning, see soot or scorch marks, or the flames look yellow and lazy instead of blue.",
            "The furnace locks out after several tries.",
            "It's short cycling even with a new filter and open vents.",
        ],
        "faqs": [
            ("Is a short cycling furnace dangerous?", "The cycling itself is the furnace protecting itself. But some causes, like an overheating heat exchanger or a blocked exhaust, are safety issues. If it keeps happening, have it checked, and make sure your carbon monoxide detectors are working."),
            ("Can I clean my own flame sensor?", "Some homeowners do, but it means shutting off power and gas and opening the burner area. If you're not comfortable with that, it's a quick job for a technician, and they'll check the rest of the startup while they're there."),
            ("How often should a furnace cycle?", "Roughly three to six heating cycles an hour is typical, depending on weather and the system. Cycles of a minute or two, over and over, aren't normal."),
            ("Will a maintenance visit prevent this?", "A yearly tune-up catches the usual causes early: dirty flame sensors, clogged drains, weak igniters and airflow problems. Frost Fire members get up to 15% off repairs."),
        ],
        "related": ["heater-not-working", "furnace-heat-pump-error-codes", "carbon-monoxide-gas-furnace"],
        "services": ["heating", "maintenance", "furnace"],
    },
    {
        "slug": "heat-pump-frozen-outdoor-unit",
        "tag": "Heat pumps",
        "title": "Heat Pump Iced Up? What to Do About a Frozen Outdoor Unit",
        "h1": "Heat pump iced up? What to do (and what not to do) about a frozen outdoor unit",
        "desc": "Frost on a heat pump is normal and defrost handles it. A solid block of ice is not. What you can safely do, what never to do, and when to call.",
        "card": "Light frost is normal. A solid block of ice isn't. Safe steps, and why you should never chip the ice.",
        "howto": True,
        "intro": p(
            "On cold, wet mornings around here, it's normal to see a light coat of white frost on your heat pump's outdoor coil. The heat pump is built for that: every so often it runs a defrost cycle, melts the frost off, and goes back to heating. You might see steam and hear a whoosh while it does it.",
            "What's not normal is ice that keeps building: a thick, clear or white shell covering the coil, ice on top of the unit, or the fan blades frozen in place. That means something is keeping the unit from defrosting or draining. Here's what to do.",
        ),
        "steps": [
            ("Tell frost from ice", p(
                "Frost is a thin, fuzzy white layer you can still see the coil fins through, and it comes and goes. Ice is thick, often clear or glassy, covers the fins completely, and doesn't go away after 30 to 90 minutes.",
                "<span class=\"fixed-it\">If it clears up on its own after a defrost cycle, it's working normally.</span>")),
            ("Never chip, scrape or hammer the ice", p(
                "The coil fins and the copper lines behind them are thin. Breaking ice off with a tool, scraper or ice pick can puncture the coil and cause a refrigerant leak, which turns a service call into a major repair.")),
            ("Turn the system to Off or Emergency Heat while you wait", p(
                "If the unit is a solid block of ice, set the thermostat to Off (or Emergency Heat if you need heat in the meantime) so the outdoor unit stops running while it's frozen. Emergency heat uses more electricity, so treat it as temporary. See <a href=\"/guides/emergency-heat-aux-heat\">emergency heat explained</a>.")),
            ("Melt it with lukewarm water, gently", p(
                "If you want to speed things up, turn the outdoor unit off at the thermostat first, then pour lukewarm (not boiling) water over the ice, or rinse it with a garden hose. Don't aim a pressure washer at the coil.")),
            ("Check what's around and under the unit", p(
                "The unit needs to drain the melt water away. Clear leaves, pine straw and mulch from around the base, and make sure the unit sits up on its pad or risers, not sunk into the ground. A gutter dripping onto the top of the unit can also cause a freeze-up. If yours does, that's worth fixing.")),
            ("Check the filter inside", p(
                "Low airflow indoors makes a heat pump work harder and can contribute to icing. Replace the indoor filter if it's dirty.")),
            ("Turn it back on and watch it", p(
                "Once the coil is clear, set the thermostat back to Heat and watch for the next hour or two. If ice builds right back up, the unit has a problem it can't fix on its own, and it needs a tech.")),
        ],
        "pro": [
            "Ice comes back after you've cleared it.",
            "The outdoor fan doesn't spin, or the unit hums but nothing moves.",
            "The unit never seems to go into defrost (no steam, no fan stop) even when frosted.",
            "Ice is on the copper lines or the top of the unit.",
            "You've been running on emergency heat for more than a day.",
        ],
        "faqs": [
            ("Why does my heat pump freeze up?", "Common causes include a failed defrost control or sensor, low refrigerant, a fan motor problem, poor drainage around the unit, or water dripping onto it from a gutter. A tech can test the defrost board and sensors and check the refrigerant charge."),
            ("Is it OK to run my heat pump while it's frozen?", "No. Running a heat pump that's encased in ice can damage it. Turn it off or use emergency heat and get it checked."),
            ("How long should a defrost cycle take?", "Usually several minutes, rarely more than 10 to 15. If it seems to run longer or happen constantly, mention that to your technician."),
            ("Can I put a cover on my heat pump in winter?", "No. Unlike an AC-only unit, a heat pump runs all winter, so it needs open airflow. Covering it causes problems."),
        ],
        "related": ["heat-pump-blowing-cold-air", "emergency-heat-aux-heat", "heater-not-working"],
        "services": ["heatpump", "emergency", "maintenance"],
    },
    {
        "slug": "carbon-monoxide-gas-furnace",
        "tag": "Safety",
        "title": "Carbon Monoxide and Your Gas Furnace: Warning Signs and When to Get It Tested",
        "h1": "Carbon monoxide and your gas furnace: warning signs and when to get it tested",
        "desc": "How carbon monoxide gets into a home, symptoms to watch for, where detectors go, what to do if the alarm sounds, and why gas furnaces need a yearly combustion check.",
        "card": "Everybody knows CO is bad. When's the last time your furnace was actually tested? Signs, detectors, and what to do.",
        "howto": False,
        "intro": p(
            "Everybody knows carbon monoxide is dangerous. Not many people know when their gas furnace was last checked to make sure it's burning clean and venting properly. Carbon monoxide (CO) has no color and no smell, which is why detectors and a yearly furnace inspection matter so much.",
            "A gas furnace that's working right sends its combustion gases outside through the vent pipe. Problems like a cracked heat exchanger, a blocked or disconnected vent, or burners that aren't burning cleanly can let CO into your home. Here's what to watch for and what to do.",
        ),
        "safety": [
            "<strong>If your CO alarm sounds:</strong> get everyone, including pets, outside into fresh air right away, then call 911 from outside. Don't open windows and stay inside to \"air it out.\"",
            "<strong>If anyone has symptoms</strong> (headache, dizziness, nausea, confusion), get them outside and call 911.",
            "<strong>Smell gas?</strong> That's a different problem, but just as serious. Leave, don't flip switches, and call your gas company or 911 from outside.",
            "<strong>Don't go back in</strong> until the fire department says it's safe.",
        ],
        "steps": [
            ("Make sure you have working CO detectors", p(
                "Put a CO detector on every level of the home and outside each sleeping area. Follow the maker's placement instructions. Many recommend keeping it at least several feet from the furnace, water heater or stove so normal startup puffs don't set it off. Test them monthly, and check the date on the back: CO sensors wear out and the units need replacing every several years.")),
            ("Know the symptoms", p(
                "CO poisoning often feels like the flu: headache, dizziness, tiredness, nausea, shortness of breath or confusion. A big clue is that several people (or pets) in the house feel sick at the same time, and they feel better when they leave home. If that sounds familiar, get everyone outside and call 911.")),
            ("Look at the furnace flame", p(
                "If you can see the burners through the sight glass, healthy flames are mostly blue and steady. Yellow, orange, lazy or floating flames, or soot around the burner area, can mean the furnace isn't burning cleanly. Don't open the burner compartment yourself. Just call for an inspection.")),
            ("Check the vent pipe", p(
                "Look at the vent pipe where you can see it: it should be firmly connected, sloped correctly and not rusted through, with no gaps at the joints. On high-efficiency furnaces, the white PVC pipes outside should be clear of debris and nests.")),
            ("Watch for other warning signs", p(
                "Stuffy or stale-smelling air, more condensation than usual on windows near the furnace, soot stains around registers or the furnace, or a pilot or burner flame that keeps going out are all reasons to get the furnace looked at soon.")),
            ("Get a combustion and safety check every year", p(
                "A proper inspection goes beyond a quick look. The technician checks the heat exchanger, tests combustion, measures CO in the flue and the living space, and makes sure the vent and draft are right. The fall, before the heavy heating season, is the best time.")),
        ],
        "pro": [
            "Your CO detector has gone off at any point, even once (after the fire department has cleared the home).",
            "The furnace flames look yellow or lazy, or there's soot around the furnace.",
            "The vent pipe is loose, rusted or disconnected.",
            "People in the home have unexplained headaches or flu-like symptoms that ease when they're away.",
            "It's been more than a year since the furnace was inspected.",
        ],
        "faqs": [
            ("Can a furnace leak carbon monoxide?", "Yes. A cracked heat exchanger, a blocked or disconnected vent, or poor combustion can let CO into the home. That's why gas furnaces need an annual safety check and every home with gas appliances needs working CO detectors."),
            ("Where should I put a carbon monoxide detector?", "On every level of the home and outside each sleeping area, following the manufacturer's instructions. Don't rely on a single detector in the basement next to the furnace."),
            ("Does a heat pump or electric furnace produce carbon monoxide?", "No. CO comes from burning fuel. All-electric systems don't produce it, but you still need CO detectors if you have any gas appliances, a fireplace or an attached garage."),
            ("What does a furnace safety inspection cost?", "Frost Fire includes safety and combustion checks in heating tune-ups, and members get up to 15% off repairs. Our diagnostic for a problem call is $59, waived if you go ahead with the repair."),
        ],
        "related": ["furnace-turns-on-then-off", "heater-not-working", "furnace-heat-pump-error-codes"],
        "services": ["heating", "maintenance", "iaq"],
    },
    {
        "slug": "emergency-heat-aux-heat",
        "tag": "Heat pumps",
        "title": "Emergency Heat vs Aux Heat on Your Thermostat: What They Mean",
        "h1": "Emergency heat and aux heat: what they mean and why they can run up your power bill",
        "desc": "What \"Aux\" and \"Emergency Heat\" mean on a heat pump thermostat, when each should be on, and why electric heat strips use so much more electricity.",
        "card": "Aux is normal on cold mornings. Emergency heat all winter can make your power bill climb fast.",
        "howto": False,
        "intro": p(
            "If you have a heat pump, your thermostat probably has two words that confuse a lot of people: <strong>Aux</strong> (auxiliary heat) and <strong>Emergency Heat</strong> (sometimes \"Em Heat\" or \"E-Heat\"). Both usually use the same thing, electric heat strips inside your indoor air handler. The difference is when and why they turn on.",
            "Understanding this matters because electric heat strips use a lot more electricity than the heat pump itself. A heat pump moves heat from outside into your home, so it often delivers two to three times as much heat for the same electricity. Heat strips make heat the way a toaster does. Run them all winter and your power bill can climb fast.",
        ),
        "steps": [
            ("Aux heat: the automatic helper", p(
                "Aux comes on by itself when the heat pump needs help: on a very cold morning, when you bump the thermostat up several degrees at once, or during a defrost cycle. Seeing Aux for a little while is normal.",
                "<span class=\"fixed-it\">Short bursts of Aux on cold mornings are normal.</span>")),
            ("Emergency heat: the manual backup", p(
                "Emergency heat is a setting <em>you</em> choose. It turns the heat pump off completely and heats the house with the strips only. It's meant for when the heat pump has failed and you're waiting for a repair, or the outdoor unit is frozen or damaged.")),
            ("Check which one is on right now", p(
                "Look at the thermostat mode. If it says Emergency Heat or Em Heat as the mode, someone switched it on, and it won't switch back by itself. Change it back to regular Heat. If it says Heat and you see Aux as a status message, the system is just asking for help, which is usually fine.")),
            ("Watch whether Aux runs all the time", p(
                "If Aux shows up for most of the day, even in mild weather, the heat pump probably isn't doing its job. The outdoor unit may not be running, may be iced up, or may be low on refrigerant, so the strips are carrying the whole load. Check the outdoor unit: is the fan spinning and the unit running?")),
            ("Don't make big jumps on the thermostat", p(
                "Raising the setpoint several degrees at once, like from 62 to 70 in the morning, tells many thermostats to bring on Aux heat to get there faster. Small, steady changes (or a smart thermostat with heat pump settings) keep the strips off more often.")),
            ("Watch your power bill", p(
                "A sudden jump in your electric bill during a normal-weather month is often the first sign that a heat pump has been running on strips. If your bill jumps and Aux shows up a lot, have the heat pump checked.")),
        ],
        "pro": [
            "Aux runs most of the day in mild weather.",
            "The outdoor unit isn't running while the thermostat is calling for heat.",
            "You've had to use Emergency Heat because the heat pump stopped working.",
            "Your power bill jumped and you can't explain why.",
            "You smell a burning odor when the heat strips come on (a little dust smell the first time each fall is normal; a strong or ongoing smell is not).",
        ],
        "faqs": [
            ("Is it bad to run emergency heat?", "It won't hurt the system, but it uses much more electricity than the heat pump. Use it only while you're waiting for a heat pump repair."),
            ("Why does my thermostat say Aux heat?", "The heat pump is asking for backup heat, usually because it's very cold outside, you raised the temperature quickly, or it's defrosting. Occasional Aux is normal; Aux all day is a sign something's wrong."),
            ("Will emergency heat turn off on its own?", "No. Emergency Heat is a mode you set, and it stays on until you switch the thermostat back to regular Heat."),
            ("Can I get my heat pump checked on a weekend?", "Yes. Frost Fire offers same-day service when we can, with no weekend or Sunday surcharge."),
        ],
        "related": ["heat-pump-blowing-cold-air", "heat-pump-frozen-outdoor-unit", "heater-not-working"],
        "services": ["heatpump", "thermostat", "maintenance"],
    },
    {
        "slug": "ac-running-not-cooling",
        "tag": "Cooling",
        "title": "AC Running But Not Cooling? A Homeowner's Checklist",
        "h1": "AC running but not cooling? A homeowner's checklist",
        "desc": "Step-by-step checks when your air conditioner runs but the house stays warm: thermostat, filter, breakers, outdoor unit, frozen lines and the condensate drain.",
        "card": "Filter, breakers, the outdoor unit, frozen lines and the drain. What to check when the AC runs but it's still hot.",
        "howto": True,
        "intro": p(
            "When the AC is running but the house won't cool down, it's usually one of a handful of things: airflow, the outdoor unit not running, a frozen coil, or a drain problem shutting things down. Here's the checklist I'd walk you through on the phone, in the order that finds the problem fastest.",
            "One note for the Triangle: on our hottest, most humid days, even a healthy system can struggle to pull the house down more than about 15 to 20 degrees below the outdoor temperature. If it's 98 outside and 78 inside and holding, that may be normal. If the house keeps getting warmer, start here. For more on causes, see our article on <a href=\"/blog/ac-running-not-cooling\">why an AC runs but doesn't cool</a>.",
        ),
        "steps": [
            ("Check the thermostat", p(
                "Make sure it's on <strong>Cool</strong> with the setpoint below the room temperature, and the fan on <strong>Auto</strong>. With the fan on \"On,\" the blower runs between cycles and can blow warm, humid air.")),
            ("Replace the filter", p(
                "A clogged filter starves the indoor coil of airflow. That reduces cooling and can freeze the coil. If it's gray and you can't see light through it, change it.")),
            ("Make sure the outdoor unit is running", p(
                "Go outside while the AC is on. You should hear the compressor humming and see the fan on top spinning, with warm air blowing up out of it. If the indoor blower is running but the outdoor unit is silent, check the breaker and the disconnect box on the wall next to the unit.",
                "If the fan isn't spinning but the unit is humming or buzzing, turn it off at the thermostat and call. A failed capacitor or fan motor is common, and running it that way can damage the compressor.")),
            ("Check the breakers", p(
                "The outdoor unit and the indoor unit usually have separate breakers. Reset a tripped one once. If it trips again, leave it off.")),
            ("Look for ice", p(
                "Check the copper lines at the outdoor unit and, if you can see it, the indoor coil. Ice or frost on the larger, insulated line or on the indoor unit means the coil is freezing, usually from low airflow or low refrigerant. Turn the system to Off (leave the fan on Auto or On) and let it thaw for a few hours before running it again. If it freezes again, call.")),
            ("Check the condensate drain and float switch", p(
                "If the AC shuts off by itself, look at the drain pan under the indoor unit (often in the attic). A full pan or a tripped float switch on the drain line will kill the cooling to protect your ceiling. Clearing the drain from the outside end with a wet/dry vac often fixes it.")),
            ("Clean around the outdoor unit", p(
                "Leaves, grass clippings, cottonwood fluff and pine straw packed against the outdoor coil block heat from escaping. Turn the power off and gently rinse the coil from the outside with a garden hose (no pressure washer), and keep plants trimmed back a couple of feet.")),
            ("Open the vents and returns", p(
                "Closed supply vents and a blocked return grille reduce airflow across the coil. Open them up, especially the return.")),
        ],
        "pro": [
            "The outdoor unit isn't running, or the fan isn't spinning while it hums.",
            "The coil or lines freeze again after thawing.",
            "Breakers keep tripping.",
            "The house keeps getting warmer even with a clean filter and a running outdoor unit (possible low refrigerant or a failing compressor).",
            "Water is leaking from the ceiling or the indoor unit.",
        ],
        "faqs": [
            ("Why is my AC running but blowing warm air?", "The most common causes are a stopped outdoor unit (often a capacitor, contactor or fan motor), a frozen coil, a dirty filter, or low refrigerant. Check the outdoor unit and the filter first."),
            ("Should I turn my AC off if it's not cooling?", "If you see ice or the outdoor fan isn't spinning, yes. Turn it off to prevent damage, let any ice thaw, and get it checked."),
            ("Can I add refrigerant myself?", "No. Refrigerant handling requires EPA certification, and if a system is low, it has a leak that needs to be found."),
            ("How fast can someone come out?", "Frost Fire offers same-day service when we can, with no weekend surcharge. The diagnostic is $59 and it's waived if you go ahead with the repair."),
        ],
        "related": ["heater-not-working", "furnace-heat-pump-error-codes", "heat-pump-blowing-cold-air"],
        "services": ["ac", "maintenance", "emergency"],
    },
    {
        "slug": "furnace-heat-pump-error-codes",
        "tag": "Troubleshooting",
        "title": "How to Read Your Furnace or Heat Pump Error Codes",
        "h1": "How to read your furnace or heat pump error codes",
        "desc": "Find the blinking light on your furnace or air handler, count the flashes, read the code chart on the door, and understand the most common codes in plain English.",
        "card": "Find the blinking light, count the flashes, read the chart on the door. Common codes in plain English.",
        "howto": True,
        "intro": p(
            "Most modern furnaces and many heat pump air handlers can tell you what's wrong. There's a small light on the control board that blinks in a pattern, and a chart that translates the pattern. Reading it before you call saves time, and sometimes it points to a simple fix like a clogged filter or a blocked vent.",
            "Every brand uses its own codes. Rheem, Ruud, Goodman, Amana, Carrier, Bryant, Trane, American Standard and Lennox all print the chart for your exact model on the inside of the panel door. So the goal here isn't to memorize codes. It's to find the light, read it correctly and match it to <em>your</em> chart.",
        ),
        "steps": [
            ("Don't turn the power off first", p(
                "On many systems, cutting power clears the current code. Read the light before you reset anything.")),
            ("Find the status light", p(
                "Look for a small window or peephole in the lower panel of the furnace or air handler. Behind it is the control board with a red, green or amber light. If there's no window, you may need to remove the upper or lower door, but remember that most units shut off when the blower door comes off (that's the door safety switch).")),
            ("Count the flashes carefully", p(
                "Codes usually come as a number of flashes, a pause, then repeat. Some use two numbers, like 3 flashes, pause, 1 flash. Watch it two or three times through. The easiest way is to take a 20-second video with your phone so you can count later and show it to your technician.")),
            ("Find the chart on the door", p(
                "The code chart is usually a sticker on the inside of the blower door or the burner door. Take a photo of it too. If the sticker is missing or faded, the model number on the unit's rating plate lets a tech look it up.")),
            ("Understand what the common codes mean", p(
                "Codes vary by brand, but they usually fall into a few groups:",
                "<strong>Steady on or slow normal blink:</strong> the system is powered and fine.<br><strong>Pressure switch:</strong> the furnace can't prove the venting is clear. Check the outside vent pipes and the condensate drain hose.<br><strong>Limit or overheating:</strong> usually airflow. Check the filter and the vents first.<br><strong>Flame failure or ignition lockout:</strong> the burners didn't light or the flame wasn't sensed. Often a flame sensor, igniter or gas supply issue.<br><strong>Rollout or flame rollout:</strong> flames came out where they shouldn't. This is a safety issue. Leave it off and call.<br><strong>Reversed polarity or wiring:</strong> an electrical problem. Call a pro.")),
            ("Check the easy fixes the code points to", p(
                "For limit codes, replace the filter and open the vents. For pressure switch codes, clear the outdoor vent pipes and check the drain hose for kinks or water. <span class=\"fixed-it\">If the code clears and the system runs normally, keep an eye on it for the next day.</span>")),
            ("Tell your technician the code", p(
                "When you call, give the brand, the code (or send the video), and what you've already checked. A tech who knows it's a pressure switch code on a Goodman furnace can show up with the right parts.")),
        ],
        "pro": [
            "Any rollout, flame rollout or gas valve code.",
            "Ignition or flame failure codes that come back after a reset.",
            "Wiring, polarity or control board codes.",
            "Limit or pressure switch codes that come back after you've changed the filter and cleared the vents.",
            "You can't find or read the code but the system won't run.",
        ],
        "faqs": [
            ("What does a blinking light on my furnace mean?", "It's a diagnostic code from the control board. Count the flashes and match the pattern to the chart on the inside of the furnace door. A slow, steady blink often just means normal operation."),
            ("Where is the error code chart on my furnace?", "It's usually a sticker on the inside of the blower or burner door. If it's missing, the model number on the rating plate lets a tech look up the chart."),
            ("Can I reset my furnace to clear the code?", "You can turn the power off and on once after you've read the code. If the same code comes back, the problem is still there. Don't keep resetting it."),
            ("Do heat pumps have error codes too?", "Many do, on the indoor air handler board, the outdoor unit's defrost board, or a communicating thermostat. Check all three."),
        ],
        "related": ["heater-not-working", "furnace-turns-on-then-off", "carbon-monoxide-gas-furnace"],
        "services": ["heating", "heatpump", "maintenance"],
    },
]

EXTRAS = {
 "heater-not-working": [
  "How to keep this from happening again",
  [
   "Most no-heat calls I see in the fall come from three things that build up over the summer: a filter nobody changed, a drain line that slowly clogged with algae while the AC was running, and a flame sensor or igniter that's been getting weaker for a while. None of those show up until the first cold night, which is exactly when everyone else is calling too.",
   "A fall tune-up catches all three. On a heating tune-up I check the filter and airflow, clean or test the flame sensor and igniter, flush the drain, test the safety switches, and on gas furnaces check combustion and the vent. On heat pumps I check the defrost controls, the refrigerant charge and the backup heat strips. Frost Fire members get up to 15% off repairs, and you get on the schedule before the rush.",
   "Two habits help too: put a reminder on your phone to change the filter every one to three months, and keep the area around the furnace or air handler clear so you (or a tech) can get to the switch, the filter and the drain in a hurry."
  ]
 ],
 "heat-pump-blowing-cold-air": [
  "Why heat pump air feels different",
  [
   "A heat pump doesn't burn anything. In winter it pulls heat out of the outdoor air (even cold air has heat in it) and moves it inside using refrigerant, the same way your AC moves heat out of the house in summer. Because it's moving heat instead of making it, it's very efficient, but the air it delivers is gentler than a gas furnace: longer run times and warm air instead of hot bursts.",
   "That's why heat pumps can seem to run constantly on cold days. Long, steady cycles are normal and usually more efficient than short ones. What matters is whether the house is holding the temperature you set. If it is, the system is doing its job, even if the air at the vent doesn't feel hot.",
   "When the temperature drops into the 20s, most heat pumps start to lose capacity, and that's where the backup heat strips come in. In the Triangle we only get a handful of mornings that cold each winter, so a heat pump that leans on backup heat every day in 40-degree weather has a problem worth fixing: low refrigerant, a failing outdoor fan or compressor, a stuck reversing valve, or a defrost control that isn't working right.",
   "A quick seasonal check (refrigerant charge, outdoor coil, defrost sensor and backup heat) keeps a heat pump heating efficiently and keeps your power bill where it should be."
  ]
 ],
 "furnace-turns-on-then-off": [
  "What's going on inside the furnace",
  [
   "A gas furnace has several safety switches that all have to agree before it'll run. The pressure switch makes sure the inducer fan is pulling exhaust out through the vent. The flame sensor proves the burners actually lit, so the gas valve doesn't keep pouring gas into a cold burner. The high-limit switch shuts the burners off if the heat exchanger gets too hot. And on high-efficiency models, a float or pressure switch watches the condensate drain.",
   "When any one of those switches opens, the control board shuts the burners down and usually logs a code. That's why short cycling is so useful to diagnose by the error light: it tells you which switch tripped. A limit trip almost always means airflow (filter, vents, a weak blower). A pressure switch trip means venting or drainage. A flame failure means ignition, the flame sensor or the gas supply.",
   "Short cycling isn't just annoying. It wears out igniters, relays and the blower motor faster, wastes gas, and in the case of overheating it puts stress on the heat exchanger, which is the part that keeps combustion gases out of your air. If a new filter and clear vents don't fix it, it's worth a diagnostic before it turns into a bigger repair. Frost Fire's diagnostic is $59 and it's waived if you go ahead with the repair."
  ]
 ],
 "heat-pump-frozen-outdoor-unit": [
  "Why heat pumps frost up in the first place",
  [
   "In heating mode, the outdoor coil gets colder than the outside air, because that's how it pulls heat from it. When the air is cold and damp, which describes a lot of winter mornings in Raleigh and Durham, moisture in the air freezes onto that cold coil, the same way frost forms on a car windshield.",
   "The heat pump's defrost control watches for that buildup using a temperature sensor and a timer. When it decides the coil needs it, it briefly reverses the system to send warm refrigerant to the outdoor coil, melts the frost, and the water drains out of the bottom of the unit. That's the steam and the whoosh you see and hear.",
   "A freeze-up happens when that process breaks down: the defrost board or sensor fails, the outdoor fan doesn't restart, the system is low on refrigerant, or the melt water can't drain and refreezes at the base. Freezing rain and ice storms can also overwhelm a perfectly good unit for a while.",
   "Prevention is mostly about drainage and maintenance. Keep the base clear, make sure the unit sits level on its pad or risers, redirect any gutter that drips onto it, and have the defrost controls and refrigerant charge checked during a fall tune-up."
  ]
 ],
 "carbon-monoxide-gas-furnace": [
  "Where carbon monoxide comes from in a home",
  [
   "Carbon monoxide is produced whenever fuel burns without enough oxygen to burn completely. A properly adjusted gas furnace burns cleanly and sends what it does produce out the vent. Trouble starts when something changes: a dirty or misadjusted burner, a cracked heat exchanger that lets combustion gases mix with the air the blower moves through your house, or a vent that's blocked, disconnected or not drafting properly.",
   "Furnaces aren't the only source. Gas water heaters, gas stoves and ovens, fireplaces, generators, and cars running in an attached garage can all produce CO. That's why I tell everyone with any fuel-burning appliance to have CO detectors on every level, even if their furnace was just checked.",
   "A furnace safety inspection is worth doing every fall. During a heating tune-up, Frost Fire checks the burners and flame, the heat exchanger, the vent connections and draft, and tests for carbon monoxide at the furnace and in the living space. If anything looks off, you'll get a clear explanation and an honest recommendation, whether that's a simple adjustment, a repair or, on an old furnace with a cracked heat exchanger, a replacement."
  ]
 ],
 "emergency-heat-aux-heat": [
  "How to keep your heat pump off the heat strips",
  [
   "The cheapest heat a heat pump system makes is from the heat pump itself. Every hour the strips carry the load is an hour you're paying for resistance heat. A few things keep that to a minimum.",
   "Keep the outdoor unit healthy. A heat pump that's low on refrigerant, has a dirty outdoor coil, or has a weak outdoor fan can't keep up, so the thermostat calls for Aux more and more. Most people don't notice until the power bill arrives.",
   "Use the right thermostat settings. Many smart thermostats have heat pump settings that limit when Aux can run, and some let you set an outdoor temperature below which Aux is allowed. If your thermostat was installed as a gas furnace thermostat, it may be bringing on the strips too early. That's worth having checked.",
   "Be careful with big setbacks. Turning the heat way down at night and way up in the morning saves money on a gas furnace, but on a heat pump it can trigger the strips every morning. Smaller setbacks of a couple of degrees, or letting the thermostat recover slowly, usually work better.",
   "A fall heat pump check covers the refrigerant charge, the outdoor coil and fan, the defrost controls and the heat strips, so you go into winter knowing the system will heat efficiently."
  ]
 ],
 "ac-running-not-cooling": [
  "What usually causes it",
  [
   "In my experience, most \"running but not cooling\" calls come down to a few repeat offenders. The most common is a failed capacitor in the outdoor unit. It's a small part that helps the compressor and fan start, and summer heat wears them out. The indoor blower keeps running, so the system seems to be on, but the outdoor unit isn't doing the work.",
   "Next are airflow problems: dirty filters, a dirty indoor coil, or a blower running slow. Low airflow makes the coil get too cold, it freezes, and once it's a block of ice it can't absorb heat at all.",
   "Then there's refrigerant. A system doesn't use up refrigerant. If it's low, there's a leak somewhere, often at a coil or a fitting. Topping it off without finding the leak just puts off the next breakdown.",
   "Finally, drain problems. Our humidity means AC systems pull a lot of water out of the air. When the drain clogs, the float switch shuts the system down to protect your ceiling, which looks like the AC just stopped cooling.",
   "A spring tune-up checks all of these before the heat arrives: capacitor and contactor, coil cleanliness, refrigerant pressures and the drain. It's a lot cheaper than a 95-degree emergency call, though we don't charge extra on weekends either way."
  ]
 ],
 "furnace-heat-pump-error-codes": [
  "A few brand notes",
  [
   "Brands lay out their codes differently. Some Goodman and Amana furnaces flash a single number. Many Carrier and Bryant boards use two-digit codes (for example, a few flashes, a pause, then a few more). Rheem and Ruud boards often have a code chart printed right on the door with the flash count next to each fault. Trane and American Standard, and Lennox with its communicating systems, may show codes on the thermostat screen as well as the board.",
   "Newer communicating and variable-speed systems may keep a history of recent faults, which is very helpful for problems that come and go. If your thermostat shows an alert or a service code, take a picture of that too.",
   "Codes point a technician in the right direction, but they aren't the whole diagnosis. A pressure switch code, for example, can mean a blocked vent, a clogged drain, a failing inducer motor, a cracked hose or a bad switch. That's why I test the system rather than just replacing the part the code names. You only pay for the repair you actually need.",
   "If you send us a short video of the blinking light and a photo of the chart when you call or text, we can often tell you whether it's something you can fix yourself, or come prepared with the right part."
  ]
 ]
}

BY_SLUG = {g["slug"]: g for g in GUIDES}


def esc(s: str) -> str:
    return html.escape(s, quote=True)


def strip_tags(s: str) -> str:
    import re

    return re.sub(r"<[^>]+>", "", s).replace("&nbsp;", " ").strip()


def header() -> str:
    return (
        '<div class="top-bar"><div class="container"><div class="top-bar-badges"><span><i class="fas fa-shield-halved"></i> Licensed &amp; Insured</span><span><i class="fas fa-calendar-check"></i> No weekend surcharge</span><span><i class="fas fa-bolt"></i> Same-day service</span></div><div class="top-bar-right"><a href="tel:' + PHONE_TEL + '"><i class="fas fa-phone"></i> ' + PHONE + '</a></div></div></div>\n'
        '  <header class="header"><nav class="nav"><a href="/" class="logo"><img src="/images/logo.svg" alt="Frost Fire Heating &amp; Cooling" style="height:48px;width:auto;"></a><ul class="nav-links"><li><a href="/#services">Services</a></li><li><a href="/#why-us">Why Us</a></li><li><a href="/#reviews">Reviews</a></li><li><a href="/service-areas">Service Areas</a></li>\n'
        '        <li><a href="/blog/">Blog</a></li><li><a href="/guides/">Homeowner Guides</a></li><li><a href="/our-work">Our Work</a></li><li><a href="/contact">Contact</a></li></ul><a href="tel:' + PHONE_TEL + '" class="nav-phone"><i class="fas fa-phone"></i><span>' + PHONE + '</span></a><button class="mobile-toggle" aria-label="Open menu" onclick="document.getElementById(\'mobileMenu\').classList.add(\'active\')"><i class="fas fa-bars"></i></button></nav></header>\n'
        '  <div class="mobile-menu" id="mobileMenu"><button class="mobile-menu-close" aria-label="Close menu" onclick="this.parentElement.classList.remove(\'active\')"><i class="fas fa-times"></i></button><a href="/#services">Services</a><a href="/service-areas">Service Areas</a><a href="/guides/">Homeowner Guides</a><a href="/our-work">Our Work</a><a href="/blog/">Blog</a><a href="/contact">Contact</a><a href="tel:' + PHONE_TEL + '" class="btn btn-primary" style="margin-top:12px"><i class="fas fa-phone"></i> Call Now</a></div>\n'
    )


def footer() -> str:
    return (
        '  <footer class="footer"><div class="container"><p>&copy; 2026 Frost Fire Heating and Cooling. Licensed &amp; Insured in NC. Serving Raleigh, Durham, the Triangle, Clayton and surrounding areas.</p><p style="margin-top:8px"><a href="/">Home</a> · <a href="/guides/">Homeowner Guides</a> · <a href="/our-work">Our Work</a> · <a href="tel:' + PHONE_TEL + '">' + PHONE + '</a> · <a href="/contact">Contact</a></p></div></footer>\n'
        '  <div class="floating-cta"><a href="tel:' + PHONE_TEL + '"><i class="fas fa-phone"></i> Call Now — ' + PHONE + '</a></div>\n'
        '  <script src="/js/analytics-config.js"></script>\n'
        '  <script src="/js/attribution.js"></script>\n'
        '  <script src="/js/quick-quote.js" defer></script>\n'
        '  <script src="/chat-widget.js"></script>\n'
        '  <script src="/js/work-photos.js" defer></script>\n'
    )


def head(title: str, desc: str, url: str, schema: list) -> str:
    blocks = "\n".join(
        f'  <script type="application/ld+json">{json.dumps(s, ensure_ascii=False)}</script>' for s in schema
    )
    return (
        "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n"
        '  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        f"  <title>{esc(title)} | Frost Fire Heating &amp; Cooling</title>\n"
        f'  <meta name="description" content="{esc(desc)}">\n'
        '  <link rel="icon" type="image/svg+xml" href="/images/favicon.svg">\n'
        '  <link rel="preconnect" href="https://fonts.googleapis.com">\n'
        '  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">\n'
        '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">\n'
        f"{blocks}\n"
        f"  <style>\n    {BASE_CSS}\n{GUIDE_CSS}\n  </style>\n"
        '  <meta property="og:type" content="article">\n'
        f'  <meta property="og:title" content="{esc(title)}">\n'
        f'  <meta property="og:description" content="{esc(desc)}">\n'
        f'  <meta property="og:url" content="{url}">\n'
        '  <meta property="og:site_name" content="Frost Fire Heating &amp; Cooling">\n'
        '  <meta property="og:locale" content="en_US">\n'
        '  <meta name="twitter:card" content="summary">\n'
        f'  <meta name="twitter:title" content="{esc(title)}">\n'
        f'  <meta name="twitter:description" content="{esc(desc)}">\n'
        f'  <link rel="canonical" href="{url}">\n'
        "</head>\n<body>\n"
    )


def cta_box() -> str:
    return (
        '<div class="cta-box">'
        "<h2>Still not working?</h2>"
        "<p><strong>Frost Fire Heating &amp; Cooling</strong>: $59 diagnostic (waived with repair), same-day service, no weekend surcharge, 4.8-star rated. Licensed &amp; Insured. Serving Raleigh, Durham, the Triangle, Clayton and surrounding areas.</p>"
        '<div class="cta-buttons">'
        f'<a href="tel:{PHONE_TEL}" class="btn-white"><i class="fas fa-phone"></i> Call {PHONE}</a>'
        '<a href="#ff-quick-quote" class="btn-outline"><i class="fas fa-calendar-alt"></i> Request a visit</a>'
        "</div></div>"
    )


ORG = {
    "@type": "HVACBusiness",
    "name": "Frost Fire Heating and Cooling",
    "telephone": PHONE_TEL,
    "url": SITE + "/",
    "address": {"@type": "PostalAddress", "addressLocality": "Clayton", "addressRegion": "NC", "postalCode": "27520", "addressCountry": "US"},
    "areaServed": ["Raleigh, NC", "Durham, NC", "Garner, NC", "Cary, NC", "Clayton, NC", "Smithfield, NC", "Fuquay-Varina, NC", "Knightdale, NC"],
}
AUTHOR = {"@type": "Person", "name": "Jax", "jobTitle": "Owner and HVAC technician", "worksFor": {"@type": "Organization", "name": "Frost Fire Heating and Cooling"}}


def build_guide(g: dict) -> str:
    url = f"{SITE}/guides/{g['slug']}"
    safety = g.get("safety") or SAFETY_DEFAULT
    steps_html = "".join(f"<li><h3>{esc(t)}</h3>{body}</li>" for t, body in g["steps"])
    faq_html = "".join(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in g["faqs"])
    related = "".join(
        f'<a href="/guides/{s}">{esc(BY_SLUG[s]["h1"][0].upper() + BY_SLUG[s]["h1"][1:])}</a>' for s in g["related"]
    )
    services = " ".join(f'<a href="{SERVICE_LINKS[k][0]}">{SERVICE_LINKS[k][1]}</a>' for k in g["services"])

    schema = [
        {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": g["title"],
            "description": g["desc"],
            "datePublished": UPDATED,
            "dateModified": UPDATED,
            "author": AUTHOR,
            "publisher": {"@type": "Organization", "name": "Frost Fire Heating and Cooling", "logo": {"@type": "ImageObject", "url": SITE + "/images/logo.svg"}},
            "mainEntityOfPage": url,
            "about": ORG,
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in g["faqs"]],
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
                {"@type": "ListItem", "position": 2, "name": "Homeowner Guides", "item": SITE + "/guides/"},
                {"@type": "ListItem", "position": 3, "name": g["title"], "item": url},
            ],
        },
    ]
    if g.get("howto"):
        schema.append({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": g["title"],
            "description": g["desc"],
            "step": [{"@type": "HowToStep", "position": i + 1, "name": t, "text": strip_tags(b)[:500]} for i, (t, b) in enumerate(g["steps"])],
        })

    safety_html = "<ul>" + "".join(f"<li>{s}</li>" for s in safety) + "</ul>"
    ex = EXTRAS.get(g["slug"])
    extra_html = (f"<h2>{esc(ex[0])}</h2>" + "".join(f"<p>{esc(x)}</p>" for x in ex[1])) if ex else ""
    pro_html = "<ul class=\"pro-list\">" + "".join(f"<li>{esc(x)}</li>" for x in g["pro"]) + "</ul>"

    body = f"""
  <section class="page-hero">
    <div class="container">
      <div class="breadcrumb"><a href="/">Home</a> <span>/</span> <a href="/guides/">Homeowner Guides</a> <span>/ {esc(g['tag'])}</span></div>
      <h1>{esc(g['h1'][0].upper() + g['h1'][1:])}</h1>
      <p class="subtitle">{esc(g['card'])}</p>
    </div>
  </section>

  <article class="guide-wrap">
    <div class="guide-meta"><span><i class="fas fa-user"></i> By Jax, owner &amp; HVAC tech</span><span><i class="fas fa-calendar"></i> Updated {UPDATED_LABEL}</span></div>
    {g['intro']}
    <div class="safety-box" role="note"><h2><i class="fas fa-triangle-exclamation"></i> Safety first</h2>{safety_html}</div>
    <h2>What to check</h2>
    <ol class="checklist">{steps_html}</ol>
    {extra_html}
    <h2>When to call a pro</h2>
    {pro_html}
    {cta_box()}
    <h2>Common questions</h2>
    <div class="faq">{faq_html}</div>
    <h2>Related guides</h2>
    <div class="related-guides">{related}</div>
    <p style="margin-top:20px"><strong>Services:</strong></p>
    <div class="service-links">{services}</div>
    <div class="author-box"><div class="avatar" aria-hidden="true">J</div><p><strong>Written by Jax, owner of Frost Fire Heating &amp; Cooling, HVAC technician.</strong> I run and work every job myself across Raleigh, Durham, the Triangle, Clayton and surrounding areas. These guides are the same checks I walk customers through on the phone.</p></div>
  </article>
"""
    return head(g["title"], g["desc"], url, schema) + "  " + header() + body + footer() + "</body>\n</html>\n"


def build_index() -> str:
    url = f"{SITE}/guides/"
    cards = "".join(
        f'<a class="guide-card" href="/guides/{g["slug"]}"><span class="tag">{esc(g["tag"])}</span><h2>{esc(g["h1"][0].upper() + g["h1"][1:])}</h2><p>{esc(g["card"])}</p></a>'
        for g in GUIDES
    )
    schema = [
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Homeowner HVAC Guides",
            "description": "Plain-English troubleshooting guides for heating and cooling problems, from a Triangle HVAC technician.",
            "url": url,
            "hasPart": [{"@type": "Article", "headline": g["title"], "url": f"{SITE}/guides/{g['slug']}"} for g in GUIDES],
            "publisher": ORG,
        }
    ]
    body = f"""
  <section class="page-hero">
    <div class="container">
      <div class="breadcrumb"><a href="/">Home</a> <span>/ Homeowner Guides</span></div>
      <h1>Homeowner HVAC guides</h1>
      <p class="subtitle">What to check before you call, in plain English. Written by Jax, the owner and tech at Frost Fire Heating &amp; Cooling.</p>
    </div>
  </section>
  <section class="guide-wrap" style="max-width:1100px">
    <p>Heat not coming on, a heat pump covered in ice, a furnace that keeps shutting off. A lot of HVAC problems have a simple cause you can check yourself in a few minutes. These guides walk you through the same safe checks I'd go over with you on the phone, and tell you when it's time to call a pro.</p>
    <div class="guide-index">{cards}</div>
    {cta_box()}
  </section>
"""
    return head("Homeowner HVAC Guides: What to Check Before You Call", "Plain-English heating and cooling troubleshooting guides from a Triangle HVAC tech: no heat, heat pump problems, error codes, carbon monoxide safety and more.", url, schema) + "  " + header() + body + footer() + "</body>\n</html>\n"


def main() -> None:
    OUT.mkdir(exist_ok=True)
    for g in GUIDES:
        (OUT / f"{g['slug']}.html").write_text(build_guide(g), encoding="utf-8")
    (OUT / "index.html").write_text(build_index(), encoding="utf-8")
    words = {g["slug"]: len(strip_tags(g["intro"] + " ".join(EXTRAS.get(g["slug"], ("", []))[1]) + "".join(b for _, b in g["steps"]) + " ".join(g["pro"]) + " ".join(q + a for q, a in g["faqs"])).split()) for g in GUIDES}
    print("built", len(GUIDES), "guides + index;", words)


if __name__ == "__main__":
    main()
