/**
 * Area pages: real, useful copy, never doorways. Housing notes are kept general and factual.
 * TODO-CONFIRM: owner to read each page and correct anything that doesn't match their experience.
 */
export interface AreaPage {
  slug: string;
  title: string; // ≤ 60
  description: string; // ≤ 155
  h1: string;
  lede: string;
  homes: string[];
  parking: string[];
  local: string[]; // extra local notes
  hoods?: { h2: string; text: string };
  faq: { q: string; a: string };
}

export const areaPages: Record<string, AreaPage> = {
  cardiff: {
    slug: 'cardiff',
    title: 'Carpet Cleaning Cardiff | Sofas, Rugs, End of Tenancy',
    description: 'Carpet, sofa and end of tenancy cleaning across Cardiff, from Roath and Canton to Pontprennau and Llandaff. Fixed price from a WhatsApp photo.',
    h1: 'Carpet & sofa cleaning across *Cardiff*',
    lede: 'Cardiff is at the heart of our area. From terraced streets in Roath and Splott to family semis in Rhiwbina and new-build estates in Pontprennau, we clean carpets, sofas, mattresses and rugs right across the city.',
    homes: [
      'Cardiff has a bit of everything, and each kind of home brings its own cleaning jobs.',
      'The Victorian and Edwardian terraces in Roath, Canton, Cathays, Splott and Grangetown often have long, narrow hallways that run straight to the stairs. That strip of carpet takes every footstep in the house, so it is usually the first thing people ask us to do.',
      'Cathays and parts of Roath have plenty of shared student houses and rented flats. End of tenancy carpet cleaning is a common job there, especially in early summer when tenancies turn over.',
      'Further out, Rhiwbina, Whitchurch, Llanishen and Cyncoed have more 1930s and post-war semis and detached homes, often with bigger lounges, fitted stairs and landings, and family sofas that have seen years of film nights. Newer estates in Pontprennau tend to have lighter carpets throughout, which show traffic lanes quickly.',
      'Cardiff Bay has lots of apartments. Lift access and parking are different there, so tell us your building when you message.',
    ],
    parking: [
      'Many streets near the centre, including parts of Roath, Cathays and Canton, have residents’ permit parking. If you have a visitor permit, it really helps, because our machine runs from the van with hoses through the front door.',
      'In apartment blocks, let us know if there is a loading bay, a car park code or a concierge we should speak to. If we have to park further away, we can still do the job; it just helps to know in advance.',
    ],
    local: [
      'We clean single rooms, whole houses, stairs and landings, sofas, mattresses and rugs, and we take on end of tenancy work for tenants, landlords and letting agents across the city.',
    ],
    hoods: {
      h2: 'Neighbourhoods we cover',
      text: 'Roath, Canton, Cathays, Llandaff, Whitchurch, Rhiwbina, Pontprennau, Cyncoed, Grangetown, Splott, Cardiff Bay, Ely, Fairwater, Llanishen, and the streets in between. If your part of Cardiff isn’t listed, it’s almost certainly covered. Just send your postcode.',
    },
    faq: {
      q: 'I live in a Cathays student house. Can you do the carpets before we hand back the keys?',
      a: 'Yes. Send photos of each room and the stairs, plus your check-out date. We’ll give you one fixed price for the house and can give you an itemised invoice to show your letting agent.',
    },
  },

  newport: {
    slug: 'newport',
    title: 'Carpet Cleaning Newport | Sofa & End of Tenancy',
    description: 'Carpet, sofa and end of tenancy cleaning in Newport, from Maindee to Rogerstone and Caerleon. WhatsApp a photo for a fixed price. No hidden charges.',
    h1: 'Carpet & sofa cleaning in *Newport*',
    lede: 'Newport is a core part of our area, not an add-on. Carpets, stairs, sofas, mattresses, rugs and end of tenancy cleans, from the terraces near the city centre to the newer estates on the edges.',
    homes: [
      'Newport’s older streets, around Maindee, St Julians and Baneswell, are lined with Victorian and Edwardian terraces. Like Cardiff’s, they tend to have a narrow hallway, a straight staircase and a through lounge, with carpet that takes a lot of wear in a small space.',
      'Caerleon has a mix of older cottages, period homes and post-war houses, often with bigger rooms and plenty of rugs. Rogerstone, Bassaleg and parts of Duffryn have more modern estates with fitted carpets throughout and light colours that show marks quickly.',
      'Newport also has plenty of rented homes, so end of tenancy carpet cleaning is a common job, for tenants moving out and landlords getting ready for the next let.',
      'Wherever you are in the city, the job is the same: we walk round with you, agree the price we quoted, and clean properly with hot water extraction. That means we spray hot water and cleaning solution deep into the fibres, then suck it straight back out with the dirt.',
    ],
    parking: [
      'Terraced streets in Newport can be tight for parking. A space near your front door makes the job quicker because our hoses run from the van. If parking is tricky on your street, tell us when you book and we’ll plan around it.',
      'For flats, let us know which floor you’re on, whether there’s a lift, and where we can unload.',
    ],
    local: [
      'Newport is close to Cwmbran and Caerphilly too, so if you have family nearby who need a clean, we can often book you in on the same day.',
    ],
    faq: {
      q: 'Do you charge extra to come to Newport from Cardiff?',
      a: 'Newport is part of our regular area, not an extra trip. The price we quote from your photo is the price you pay, with nothing added on the day.',
    },
  },

  penarth: {
    slug: 'penarth',
    title: 'Carpet Cleaning Penarth | Sofas, Rugs & Mattresses',
    description: 'Carpet, sofa and rug cleaning in Penarth. Period homes, seafront flats and family houses. Fixed price from a WhatsApp photo, no hidden charges.',
    h1: 'Carpet, sofa & rug cleaning in *Penarth*',
    lede: 'Penarth is just over the barrage from Cardiff Bay, so it’s close to home for us. Large period homes, flats by the marina and family houses further out all need something a little different.',
    homes: [
      'Penarth is known for its Victorian and Edwardian houses, many with high ceilings, tall staircases and long hallways. Those staircases are often the main job: lots of steps, often a pale runner or fitted carpet, and a landing that sees the whole family pass every day.',
      'Many period homes also have good wool rugs on wooden floors. Wool cleans beautifully, but it needs the right temperature and a gentle solution, so we always check the fibre and test a corner first.',
      'Nearer the marina there are plenty of apartments, where we tend to clean lighter carpets, sofas and mattresses. Further out, around Cogan and Sully Road, there are more family homes with fitted carpets throughout.',
      'Sea air and damp winters mean rooms can take a little longer to dry here. We bring air movers and leave you simple tips, like keeping the heating on low and a window open, so the carpet dries properly.',
    ],
    parking: [
      'Some of Penarth’s streets are narrow, and the seafront and town centre get busy at weekends. If you have a drive, or a space right outside, please keep it free for us on the day.',
      'In marina apartments, tell us about any car park access codes or loading areas when you book.',
    ],
    local: [
      'We clean carpets, stairs, sofas, mattresses and rugs in Penarth, and handle end of tenancy cleaning for rentals and holiday lets.',
      'If you’re selling a period home in Penarth, freshly cleaned stair runners and hallway carpets make a real difference in photos and viewings. Tell us your viewing or photography date and we’ll book the clean so everything is dry and the pile has settled in time.',
    ],
    faq: {
      q: 'Can you clean a wool rug on a wooden floor without damaging the floor?',
      a: 'Yes. We protect the floor under and around the rug, use a low-moisture method, and lay the rug flat to dry with airflow. We test the rug for colour run first.',
    },
  },

  barry: {
    slug: 'barry',
    title: 'Carpet Cleaning Barry | Sofas & End of Tenancy',
    description: 'Carpet, sofa and end of tenancy cleaning in Barry, from Barry Island to the Waterfront. WhatsApp a photo for a fixed price. Pet and child friendly.',
    h1: 'Carpet & sofa cleaning in *Barry*',
    lede: 'From the terraces up the hill to the newer homes on the Waterfront, we clean carpets, stairs, sofas and mattresses across Barry, and help with end of tenancy and holiday let turnovers.',
    homes: [
      'Barry has a lot of Victorian and Edwardian terraced houses, especially around the town centre and Cadoxton, with narrow hallways and steep stairs. Sand from the beach finds its way into every hallway carpet in summer, and grit is one of the main things that wears carpet down.',
      'The newer homes around the Waterfront and on the edges of town often have light, fitted carpets in every room. They look great but show traffic lanes fast, especially with children and pets.',
      'There are also holiday lets and rentals near Barry Island. Between guests, we can clean carpets, sofas and mattresses and send photos so you know it’s done.',
      'We use hot water extraction: we spray hot water and cleaning solution deep into the fibres, then suck it straight back out with the dirt. For sandy carpets, we spend extra time hoovering first, because sand is heavy and sits right at the bottom of the pile.',
    ],
    parking: [
      'On terraced streets, parking can be tight. A space close to your door saves time because the hoses run from the van. In summer, the roads near the Island get very busy, so an earlier slot can help.',
      'If you’re in a flat on the Waterfront, let us know about parking and which floor you’re on.',
      'Holiday lets near the Island often change over on the same day. Tell us the check-out and check-in times when you message, and we’ll tell you honestly whether the carpets will be dry in time.',
    ],
    local: [
      'Barry is close to Penarth and Cardiff, so ask about short-notice slots. We offer them when we have them.',
      'Dogs who love the beach bring home wet paws, sand and the odd accident. Our pet-friendly solutions are rinsed out, and we treat pet odours at the source, under the pile, rather than covering them with perfume.',
    ],
    faq: {
      q: 'Can you get beach sand out of carpets?',
      a: 'Yes. Sand sits deep in the pile, so we do a slow, thorough dry hoover with our machine before the wet clean. That way it comes out instead of turning to grit in the carpet.',
    },
  },

  caerphilly: {
    slug: 'caerphilly',
    title: 'Carpet Cleaning Caerphilly | Sofas & Mattresses',
    description: 'Carpet, sofa and mattress cleaning in Caerphilly. Terraces, family homes and new builds. Fixed price from a WhatsApp photo, no hidden charges.',
    h1: 'Carpet & sofa cleaning in *Caerphilly*',
    lede: 'Just north of Cardiff over the mountain, Caerphilly is well within our area. Carpets, stairs, sofas, mattresses and rugs, cleaned properly at a price agreed from your photo.',
    homes: [
      'Caerphilly has plenty of traditional terraces, many on sloping streets, along with larger family homes and newer estates on the edges of town. Older terraces often have a front door opening straight onto the stairs, so the bottom few steps take a lot of wear.',
      'Newer homes tend to have fitted carpet throughout, including the stairs and landings, so a whole-house clean makes sense: everything done in one visit, at one fixed price.',
      'In the valleys, damp days are common, and carpets and upholstery can take longer to dry. We bring air movers, and we’ll tell you how to keep the air moving afterwards, so carpets dry properly instead of smelling musty.',
      'Every job starts the same way: shoe covers on, a walk round with you, and a patch test on anything delicate. Then a pre-treatment on the stains, and hot water extraction. That means we spray hot water and cleaning solution deep into the fibres, then suck it straight back out with the dirt.',
    ],
    parking: [
      'On steep or narrow streets, please tell us if parking is tricky. Our hoses are long, but a space near the door makes the visit quicker and tidier.',
      'If you’re on a new-build estate with allocated spaces, let us know which one we can use.',
    ],
    local: [
      'We clean carpets, stairs, sofas, mattresses and rugs in Caerphilly and the villages around it, and do end of tenancy cleaning for tenants and landlords.',
      'Many Caerphilly families have lived in the same house for years, with carpets that have seen children grow up and pets come and go. Older carpets clean up brighter and fresher, but cleaning can’t replace worn fibres. We’ll tell you honestly what to expect before we start, so you can decide whether cleaning or replacing is the better spend.',
    ],
    faq: {
      q: 'My house is on a steep hill. Is that a problem?',
      a: 'Not usually. Our hoses reach a long way from the van. Just tell us when you book, and send a photo of the front of the house if parking is tight.',
    },
  },

  cwmbran: {
    slug: 'cwmbran',
    title: 'Carpet Cleaning Cwmbran | Sofas & End of Tenancy',
    description: 'Carpet, sofa and end of tenancy cleaning in Cwmbran. Family homes, rentals and new builds. WhatsApp a photo for a fixed price, no hidden charges.',
    h1: 'Carpet & sofa cleaning in *Cwmbran*',
    lede: 'Cwmbran is a short drive up from Newport, well within our area. Carpets, stairs, sofas, mattresses and end of tenancy work, all priced from a photo.',
    homes: [
      'Cwmbran was built as a new town after the Second World War, so much of it is made up of family houses from the 1950s to the 1970s, laid out in neighbourhoods with their own shops and green spaces. These homes usually have a straight staircase, a landing, three bedrooms and a lounge: a typical whole-house clean.',
      'There are also newer estates on the edges of town, with fitted carpets throughout. Light carpets in busy family homes show wear quickly, especially on stairs and in lounges.',
      'A good number of homes here are rented, so end of tenancy carpet cleaning is a common need, for tenants moving out and landlords preparing for the next family.',
      'However old the house, the process is the same. We patch-test first, pre-treat stains, then use hot water extraction: we spray hot water and cleaning solution deep into the fibres, then suck it straight back out with the dirt.',
    ],
    parking: [
      'Many Cwmbran streets have shared parking areas or footpaths to the front door rather than parking outside. If our van can’t get close, tell us when you book and send a quick photo, and we’ll plan the hose route.',
    ],
    local: [
      'Cwmbran is close to Newport, so ask about short-notice slots. We offer them when we have them.',
      'Many of Cwmbran’s family homes have open-plan lounges that lead straight from the front door, with no porch or hallway to catch the dirt. That first stretch of carpet takes the brunt of every school run and dog walk, so we pre-treat it separately before the main clean. Large corner sofas are popular here too, and we can clean them in the same visit for one fixed price.',
    ],
    faq: {
      q: 'Our front door is on a footpath, not the road. Can you still clean?',
      a: 'Usually, yes. Our hoses are long. Send us a photo of the route from the nearest parking to your door, and we’ll let you know before the day.',
    },
  },

  pontypridd: {
    slug: 'pontypridd',
    title: 'Carpet Cleaning Pontypridd | Sofas & Mattresses',
    description: 'Carpet, sofa and mattress cleaning in Pontypridd and nearby. Terraced homes, stairs and rentals. Fixed price from a WhatsApp photo, no hidden charges.',
    h1: 'Carpet & sofa cleaning in *Pontypridd*',
    lede: 'Where the Taff and Rhondda valleys meet, Pontypridd is full of terraced homes with busy stairs and hallways. We clean carpets, sofas, mattresses and rugs, and help with end of tenancy cleans.',
    homes: [
      'Pontypridd’s terraced streets climb the valley sides, and many homes open straight onto the stairs or a short hallway. That means the first metre of carpet takes everything that comes in from outside: rain, mud and grit.',
      'The town also has plenty of student and rented homes near the university campus in Treforest, so end of tenancy carpet cleaning is in demand, especially at the end of the academic year.',
      'Valley weather is wet, and homes can take longer to dry out. We bring air movers, use a controlled amount of water, and leave aftercare tips so your carpets dry properly instead of smelling damp.',
      'Our method is the same as everywhere else. We patch-test, pre-treat stains, then use hot water extraction: we spray hot water and cleaning solution deep into the fibres, then suck it straight back out with the dirt.',
    ],
    parking: [
      'Steep, narrow streets are part of life here. If parking near the door is hard, tell us when you book. A photo of the street helps us plan.',
      'For flats or shared houses, let us know who will let us in and where the tap and socket are.',
    ],
    local: [
      'We cover Pontypridd, Treforest and the villages around them. Send your postcode with your photo and we’ll confirm.',
      'Older valley homes often have narrow staircases with a turn at the top, and the carpet on those turning steps wears fastest of all. We clean every step by hand with a smaller tool, including the awkward winders. If you’re a landlord with several houses in Pontypridd or Treforest, send photos of each and we’ll quote for them together.',
    ],
    faq: {
      q: 'We’re students in Treforest. Can you clean the carpets before we move out?',
      a: 'Yes. Send a photo of each room, the stairs and your move-out date. We’ll give you one fixed price for the house, which you can split between housemates.',
    },
  },
};
