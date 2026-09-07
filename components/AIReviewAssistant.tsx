"use client";

import { useMemo, useState } from "react";

type ReviewStyle = "short" | "natural" | "detailed";
type ReviewLanguage = "english" | "nepali";

type Props = {
  businessName: string;
  businessType: string;
  rating: number;
};

type ReviewProfile = {
  topics: string[];
  openings: string[];
  observations: string[];
  quality: string[];
  service: string[];
  atmosphere: string[];
  transitions: string[];
  endings: string[];
};

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function formatList(items: string[]) {
  if (items.length === 0) return "";

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function normalizeBusinessType(type: string) {
  const value = type.toLowerCase();

  if (value.includes("restaurant")) return "restaurant";
  if (value.includes("hotel")) return "hotel";
  if (value.includes("lodge")) return "lodge";
  if (value.includes("cafe")) return "cafe";
  if (value.includes("salon")) return "salon";
  if (value.includes("shop")) return "shop";
  if (value.includes("kirana")) return "kirana";
  if (value.includes("travel")) return "travel";
  if (value.includes("pharmacy")) return "pharmacy";
  if (value.includes("clinic")) return "clinic";

  return "general";
}

function getRatingLanguage(rating: number) {
  if (rating <= 1) {
    return {
      tone: "critical",
      positives: false,
    };
  }

  if (rating === 2) {
    return {
      tone: "mixed",
      positives: true,
    };
  }

  if (rating === 3) {
    return {
      tone: "balanced",
      positives: true,
    };
  }

  if (rating === 4) {
    return {
      tone: "positive",
      positives: true,
    };
  }

  return {
    tone: "excellent",
    positives: true,
  };
}

function getReviewProfile(type: string, rating: number): ReviewProfile {
  const normalized = normalizeBusinessType(type);
  const ratingInfo = getRatingLanguage(rating);

  const positive = ratingInfo.tone !== "critical";

  if (normalized === "restaurant") {
    return {
      topics: [
        "food",
        "taste",
        "presentation",
        "service",
        "staff",
        "cleanliness",
        "ambience",
        "portion size",
        "menu variety",
        "value for money",
      ],

      openings: positive
        ? [
            "My visit to {business} turned out to be a genuinely enjoyable experience.",
            "I recently spent some time at {business}, and the overall experience was better than I expected.",
            "There is a lot to appreciate about {business}, particularly if you care about good food and attentive service.",
            "I was pleasantly surprised by how well {business} balances food quality with a comfortable dining experience.",
            "From the moment I arrived at {business}, the experience felt thoughtfully managed.",
            "I had been meaning to try {business}, and I am glad I finally did.",
            "What stood out to me most about {business} was how polished the overall dining experience felt.",
          ]
        : [
            "My experience at {business} was not quite what I had hoped for.",
            "I visited {business} recently and came away with mixed feelings.",
            "There were some good aspects to my visit to {business}, although several things could be improved.",
          ],

      observations: positive
        ? [
            "The food was carefully prepared and arrived with a presentation that showed attention to detail.",
            "The flavours were well balanced without feeling unnecessarily heavy or over-seasoned.",
            "The dishes had a fresh, well-considered quality that made the meal particularly enjoyable.",
            "The menu offered enough variety to make the choice interesting without becoming overwhelming.",
            "The portions were sensible, and the quality felt consistent throughout the meal.",
            "The dining area was comfortable, clean, and pleasant enough to encourage a relaxed meal.",
            "The atmosphere added to the experience rather than distracting from the food.",
            "The staff were courteous and handled requests with a professional attitude.",
          ]
        : [
            "Some of the dishes were enjoyable, but the consistency was not quite where I expected it to be.",
            "The food had potential, although certain aspects of preparation and presentation could be improved.",
            "The service was acceptable in parts, but the overall experience lacked the smoothness I was expecting.",
          ],

      quality: positive
        ? [
            "The ingredients tasted fresh and the preparation felt deliberate.",
            "There was a noticeable level of care in both flavour and presentation.",
            "The quality was reassuringly consistent across what we ordered.",
            "The meal felt thoughtfully prepared rather than simply assembled.",
            "The food demonstrated a good understanding of texture, seasoning, and presentation.",
          ]
        : [
            "The quality felt somewhat inconsistent during my visit.",
            "A little more attention to preparation and consistency would make a noticeable difference.",
            "The food was reasonable, although it did not fully justify the expectations I had before visiting.",
          ],

      service: positive
        ? [
            "The staff were attentive without being intrusive.",
            "Service was efficient, polite, and appropriately responsive.",
            "The team handled the dining experience with a calm and professional manner.",
            "Everyone I interacted with was friendly and willing to help.",
            "The staff contributed significantly to the comfortable atmosphere.",
          ]
        : [
            "The staff were polite, although the service could have been more coordinated.",
            "Communication was acceptable but not as prompt as I would have preferred.",
            "The team was courteous, although there were a few delays during the visit.",
          ],

      atmosphere: [
        "The ambience was comfortable and suited a relaxed meal.",
        "The setting had a welcoming character without feeling overly formal.",
        "The dining space was clean and reasonably well maintained.",
        "The atmosphere made it easy to settle in and enjoy the meal.",
        "The overall environment felt pleasant and thoughtfully arranged.",
      ],

      transitions: [
        "What I particularly appreciated was",
        "Another positive aspect was",
        "Beyond the food itself,",
        "What made the visit stand out was",
        "I also liked that",
        "One detail worth mentioning is that",
        "Taken together,",
      ],

      endings: positive
        ? [
            "I would happily return to {business.",
            "I would recommend {business} to anyone looking for a dependable dining experience.",
            "Overall, {business} left me with a very positive impression.",
            "I would definitely consider coming back on another occasion.",
            "For the quality and overall experience, {business} is worth visiting.",
            "It is the kind of place I would be comfortable recommending to friends.",
          ]
        : [
            "I hope the team takes the feedback constructively and improves the weaker areas.",
            "There is a solid foundation here, but consistency would make a significant difference.",
            "I may give {business} another try in the future if the service and consistency improve.",
          ],
    };
  }

  if (normalized === "hotel" || normalized === "lodge") {
    return {
      topics: [
        "room",
        "bed",
        "cleanliness",
        "hospitality",
        "reception",
        "breakfast",
        "location",
        "facilities",
        "staff",
        "comfort",
        "value",
      ],

      openings: positive
        ? [
            "My stay at {business} was a thoroughly pleasant experience.",
            "I recently stayed at {business}, and the property made a strong impression on me.",
            "I was quite pleased with my experience at {business}.",
            "After spending some time at {business}, I can understand why guests speak positively about the property.",
            "My stay at {business} was comfortable, well organized, and genuinely relaxing.",
            "From check-in onward, {business} provided a smooth and welcoming experience.",
            "I found {business} to be a comfortable base with several thoughtful touches throughout the stay.",
          ]
        : [
            "My stay at {business} was mixed, with some aspects working better than others.",
            "I recently stayed at {business} and felt that the experience could have been more consistent.",
            "There were some positives during my stay at {business}, but there were also areas that need attention.",
          ],

      observations: positive
        ? [
            "The room was clean, comfortable, and adequately maintained.",
            "The bed was comfortable enough for a good night's rest.",
            "The reception team were courteous and handled the check-in process efficiently.",
            "The staff were welcoming and generally attentive to guests' needs.",
            "The property had a calm atmosphere that made the stay feel relaxing.",
            "The location was convenient for getting around and accessing nearby attractions.",
            "Breakfast was satisfying and offered a reasonable selection.",
            "The facilities were maintained to a good standard.",
          ]
        : [
            "The room was acceptable overall, although some areas would benefit from better maintenance.",
            "The reception process was straightforward, but the service did not always feel particularly attentive.",
            "The location was convenient, although the overall level of comfort did not completely meet my expectations.",
          ],

      quality: positive
        ? [
            "The room appeared well maintained and thoughtfully prepared.",
            "The cleanliness was noticeable from the moment I entered.",
            "The property showed a reassuring level of attention to detail.",
            "The accommodation felt comfortable without unnecessary complications.",
            "The overall standard was consistent with what I would expect from a well-managed property.",
          ]
        : [
            "The property has potential, although maintenance and consistency could be improved.",
            "A little more attention to housekeeping and upkeep would noticeably improve the guest experience.",
            "The standard was reasonable, but it did not feel consistently polished.",
          ],

      service: positive
        ? [
            "The staff were polite, responsive, and professional.",
            "The reception team handled requests efficiently.",
            "Communication with the staff was easy throughout the stay.",
            "The hospitality felt genuine rather than overly scripted.",
            "The team made the stay more comfortable through small but meaningful gestures.",
          ]
        : [
            "The staff were generally polite, although responsiveness could have been better.",
            "Communication was adequate but occasionally slower than expected.",
            "The team was courteous, although the service lacked consistency at times.",
          ],

      atmosphere: [
        "The property had a peaceful atmosphere that suited a short getaway.",
        "The common areas were pleasant and reasonably well maintained.",
        "The overall environment felt comfortable and welcoming.",
        "The setting made the stay feel more relaxed than rushed.",
        "The property had a practical yet pleasant character.",
      ],

      transitions: [
        "One thing I especially appreciated was",
        "Another aspect worth mentioning is",
        "Beyond the room itself,",
        "What contributed to the stay was",
        "I also found that",
        "A particularly nice touch was",
        "Overall,",
      ],

      endings: positive
        ? [
            "I would be happy to stay at {business} again.",
            "I would comfortably recommend {business} to other travellers.",
            "Overall, {business} provided a pleasant and dependable stay.",
            "I would consider returning the next time I am in the area.",
            "The experience left me with a favourable impression of {business}.",
          ]
        : [
            "I hope the property addresses these issues because the location and overall concept have potential.",
            "With stronger consistency and maintenance, the guest experience could improve considerably.",
            "I would consider returning if the weaker areas are addressed.",
          ],
    };
  }

  if (normalized === "salon") {
    return {
      topics: [
        "haircut",
        "styling",
        "consultation",
        "staff behaviour",
        "cleanliness",
        "attention to detail",
        "product quality",
        "final result",
        "professionalism",
        "value",
      ],

      openings: positive
        ? [
            "I had a very satisfying experience at {business}.",
            "My visit to {business} was much better than a routine salon appointment.",
            "I recently visited {business} and was impressed by the overall standard of service.",
            "The experience at {business} felt professional from the beginning.",
            "I am genuinely pleased with the result I received at {business}.",
            "What stood out about {business} was the combination of technical skill and attentive service.",
          ]
        : [
            "My experience at {business} was mixed and could have been more polished.",
            "I visited {business} recently and felt that some aspects of the service needed improvement.",
          ],

      observations: positive
        ? [
            "The stylist listened carefully before beginning and understood what I was looking for.",
            "The haircut was precise, well balanced, and suited what I had requested.",
            "The styling was handled with noticeable attention to detail.",
            "The staff were friendly without making the appointment feel rushed.",
            "The salon was clean, organized, and comfortable.",
            "The final result was close to what I had in mind.",
            "The consultation was particularly useful because my preferences were taken seriously.",
          ]
        : [
            "The consultation could have been more thorough before the service began.",
            "The final result was reasonable, although it did not fully match what I had requested.",
            "The salon was acceptable, but a little more attention to detail would improve the experience.",
          ],

      quality: positive
        ? [
            "The work showed good technical control and careful finishing.",
            "The result looked natural and professionally finished.",
            "The service demonstrated a good understanding of proportion, texture, and styling.",
            "The products used appeared to be of respectable quality.",
          ]
        : [
            "The technical work was acceptable, although the finishing could have been more precise.",
            "The final result was decent but lacked the refinement I was hoping for.",
          ],

      service: positive
        ? [
            "The staff were attentive and easy to communicate with.",
            "The stylist was professional, patient, and receptive to feedback.",
            "The appointment was handled efficiently without feeling rushed.",
            "The team created a comfortable and respectful environment.",
          ]
        : [
            "The staff were polite, although communication could have been clearer.",
            "The service was courteous but could have felt more personalized.",
          ],

      atmosphere: [
        "The salon had a clean and comfortable atmosphere.",
        "The environment felt modern without being unnecessarily flashy.",
        "The space was well organized and pleasant to spend time in.",
        "The overall setting contributed to a relaxed appointment.",
      ],

      transitions: [
        "What I appreciated most was",
        "Another thing that stood out was",
        "Beyond the actual service,",
        "I particularly liked that",
        "One detail worth mentioning is",
        "The strongest part of the visit was",
      ],

      endings: positive
        ? [
            "I would definitely return to {business}.",
            "I would recommend {business} to anyone looking for careful and professional salon service.",
            "Overall, I left {business} feeling very satisfied with the result.",
            "I am happy with the outcome and would visit again.",
          ]
        : [
            "I hope the team takes the feedback seriously and improves the consistency of the service.",
            "There is room for improvement, particularly in consultation and finishing.",
            "I would consider returning if these areas are addressed.",
          ],
    };
  }

  if (normalized === "travel") {
    return {
      topics: [
        "itinerary",
        "communication",
        "guide",
        "transport",
        "organization",
        "timing",
        "hospitality",
        "planning",
        "value",
        "overall coordination",
      ],

      openings: positive
        ? [
            "My experience with {business} was extremely well organized from beginning to end.",
            "I recently travelled through {business}, and the overall arrangement was impressively smooth.",
            "The trip arranged by {business} was one of the more professionally coordinated travel experiences I have had.",
            "I appreciated the level of organization shown by {business} throughout the journey.",
            "Working with {business} made the trip considerably easier and more enjoyable.",
            "The team at {business} handled the logistics with a reassuring degree of professionalism.",
          ]
        : [
            "My experience with {business} was mixed, particularly in terms of coordination.",
            "I used {business} for a trip recently and felt there were several areas that could have been better organized.",
          ],

      observations: positive
        ? [
            "The itinerary was sensible and gave enough structure without making the trip feel rushed.",
            "Communication before and during the trip was clear and reasonably prompt.",
            "The guide was knowledgeable and communicated information in an engaging way.",
            "Transport arrangements were handled efficiently.",
            "The team appeared prepared for the practical details of the journey.",
            "The schedule was well balanced between activities and downtime.",
            "The staff were responsive whenever clarification was needed.",
          ]
        : [
            "The itinerary was workable, although some parts could have been communicated more clearly.",
            "There were a few coordination issues that made the experience less seamless than expected.",
            "The transport and timing arrangements could have been managed more efficiently.",
          ],

      quality: positive
        ? [
            "The planning demonstrated a good understanding of what travellers actually need.",
            "The arrangements felt deliberate rather than improvised.",
            "The overall coordination gave me confidence in the team.",
            "The service reflected a useful combination of local knowledge and practical planning.",
          ]
        : [
            "The planning was reasonable, but stronger coordination would have made the trip considerably smoother.",
            "Some arrangements felt less organized than they should have been.",
          ],

      service: positive
        ? [
            "The team remained approachable and responsive throughout.",
            "Communication was professional without becoming overly formal.",
            "The guide and support staff were courteous and knowledgeable.",
            "Questions were handled patiently and clearly.",
          ]
        : [
            "The staff were generally courteous, although communication could have been more proactive.",
            "The team responded when contacted, but some information could have been provided earlier.",
          ],

      atmosphere: [
        "The trip itself felt relaxed because most practical details were already taken care of.",
        "The experience had a good balance between structure and flexibility.",
        "The overall arrangement allowed me to focus on enjoying the destination rather than worrying about logistics.",
      ],

      transitions: [
        "What I found particularly useful was",
        "Another strong point was",
        "Beyond the itinerary itself,",
        "I also appreciated that",
        "One aspect that deserves credit is",
      ],

      endings: positive
        ? [
            "I would happily use {business} again for a future trip.",
            "I would recommend {business} to travellers who value reliable organization.",
            "Overall, {business} delivered a well coordinated travel experience.",
            "The service gave me confidence that the team understands how to manage the practical side of travel.",
          ]
        : [
            "With better communication and coordination, the overall experience could improve significantly.",
            "I hope the team uses this feedback to strengthen the planning process.",
            "I would consider using {business} again if the coordination becomes more consistent.",
          ],
    };
  }

  if (
    normalized === "shop" ||
    normalized === "kirana" ||
    normalized === "pharmacy"
  ) {
    return {
      topics: [
        "product quality",
        "product variety",
        "availability",
        "pricing",
        "staff behaviour",
        "cleanliness",
        "service",
        "organization",
        "value",
        "convenience",
      ],

      openings: positive
        ? [
            "I had a very positive experience shopping at {business}.",
            "I recently visited {business} and was impressed by the overall service.",
            "{business} offers a refreshingly straightforward shopping experience.",
            "My visit to {business} was efficient, pleasant, and well managed.",
            "I found {business} to be a reliable option for everyday shopping.",
            "What stood out to me about {business} was the combination of product availability and helpful service.",
          ]
        : [
            "My experience at {business} was acceptable but not particularly consistent.",
            "I visited {business} recently and noticed several areas that could be improved.",
          ],

      observations: positive
        ? [
            "The products were well organized and reasonably easy to find.",
            "There was a useful range of products available.",
            "The staff were approachable and willing to help when needed.",
            "Prices appeared reasonable in relation to the quality.",
            "The store was clean and maintained in an orderly manner.",
            "The checkout process was straightforward and efficient.",
            "Product information was clear enough to make purchasing decisions easier.",
          ]
        : [
            "The selection was reasonable, although availability could have been better.",
            "The staff were polite, but service was slower than expected.",
            "The store was functional, although organization could be improved.",
          ],

      quality: positive
        ? [
            "The products appeared fresh and properly maintained.",
            "The overall product quality was reassuring.",
            "The selection suggested that the business pays attention to what customers actually need.",
            "The products I purchased were in good condition.",
          ]
        : [
            "The product quality was acceptable, although consistency could be improved.",
            "Some items were satisfactory while others did not meet the same standard.",
          ],

      service: positive
        ? [
            "The staff were polite, efficient, and genuinely helpful.",
            "The team handled questions with patience.",
            "The service was quick without feeling careless.",
            "The staff made the shopping process considerably easier.",
          ]
        : [
            "The staff were courteous, although service could have been faster.",
            "The team was helpful when approached, but more proactive assistance would have been appreciated.",
          ],

      atmosphere: [
        "The store was clean and reasonably well organized.",
        "The layout made the shopping experience convenient.",
        "The environment felt practical and customer friendly.",
        "The store was easy to navigate without unnecessary clutter.",
      ],

      transitions: [
        "What I especially liked was",
        "Another useful aspect was",
        "Beyond the products themselves,",
        "I also appreciated that",
        "One thing worth mentioning is",
      ],

      endings: positive
        ? [
            "I would happily shop at {business} again.",
            "I would recommend {business} to people looking for convenient and reliable service.",
            "Overall, {business} left a very good impression.",
            "I expect to return when I need similar products.",
          ]
        : [
            "There is room for improvement, particularly in consistency and service speed.",
            "I hope the business addresses these areas because the overall setup has potential.",
            "I may return in the future if these issues are improved.",
          ],
    };
  }

  if (normalized === "cafe") {
    return {
      topics: [
        "coffee",
        "food",
        "desserts",
        "service",
        "staff",
        "ambience",
        "cleanliness",
        "presentation",
        "value",
        "comfort",
      ],

      openings: positive
        ? [
            "I really enjoyed spending time at {business}.",
            "{business} turned out to be a lovely place to slow down and enjoy a good coffee.",
            "My visit to {business} was relaxed, comfortable, and genuinely enjoyable.",
            "I was pleasantly surprised by the overall experience at {business}.",
            "There is something particularly comfortable about the atmosphere at {business}.",
          ]
        : [
            "My experience at {business} was mixed.",
            "I visited {business} recently and felt the experience could have been more consistent.",
          ],

      observations: positive
        ? [
            "The coffee was well prepared and had a pleasant flavour.",
            "The food was fresh and nicely presented.",
            "The ambience was calm enough for a relaxed conversation.",
            "The staff were friendly and attentive.",
            "The space was clean and comfortable.",
            "The presentation showed a thoughtful level of detail.",
            "The overall setting made it easy to spend some time there without feeling rushed.",
          ]
        : [
            "The coffee was reasonable, although consistency could be improved.",
            "The ambience was pleasant, but the service was slower than expected.",
            "The food was acceptable, although the presentation could have been better.",
          ],

      quality: positive
        ? [
            "The preparation felt careful rather than rushed.",
            "The quality was consistent with the relaxed character of the café.",
            "The flavours were balanced and enjoyable.",
          ]
        : [
            "The quality was acceptable, although it was not particularly memorable.",
            "A little more consistency would improve the overall experience.",
          ],

      service: positive
        ? [
            "The staff were warm, polite, and easy to approach.",
            "Service was efficient without feeling mechanical.",
            "The team maintained a friendly attitude throughout.",
          ]
        : [
            "The staff were polite, although the service could have been more responsive.",
            "The team was courteous but somewhat slow during my visit.",
          ],

      atmosphere: [
        "The ambience was one of the strongest parts of the experience.",
        "The setting felt comfortable without being overly formal.",
        "The café had a pleasant balance of energy and calm.",
        "The space was clean, inviting, and easy to settle into.",
      ],

      transitions: [
        "What I particularly enjoyed was",
        "Another nice touch was",
        "Beyond the food and drinks,",
        "I also appreciated that",
        "The atmosphere deserves a mention because",
      ],

      endings: positive
        ? [
            "I would happily come back to {business}.",
            "It is definitely a place I would recommend for a relaxed break.",
            "Overall, {business} left me with a very positive impression.",
            "I would be glad to visit again.",
          ]
        : [
            "I hope the team improves the consistency because the café has potential.",
            "With stronger service and consistency, the experience could be considerably better.",
          ],
    };
  }

  if (normalized === "clinic") {
    return {
      topics: [
        "staff behaviour",
        "communication",
        "cleanliness",
        "organization",
        "waiting time",
        "professionalism",
        "facilities",
        "overall service",
      ],

      openings: positive
        ? [
            "My experience at {business} was handled in a professional and organized manner.",
            "I found the overall service at {business} reassuring and well managed.",
            "My visit to {business} was smooth and professionally coordinated.",
            "I appreciated the calm and organized approach at {business}.",
          ]
        : [
            "My experience at {business} was mixed and could have been better organized.",
            "I visited {business} recently and noticed several areas that could be improved.",
          ],

      observations: positive
        ? [
            "The staff communicated clearly and treated me respectfully.",
            "The environment was clean and appropriately maintained.",
            "The process was organized and reasonably straightforward.",
            "The staff appeared professional and attentive.",
            "The waiting process was managed reasonably well.",
          ]
        : [
            "The waiting process took longer than expected.",
            "Communication could have been clearer during the visit.",
            "The organization was acceptable but not especially efficient.",
          ],

      quality: positive
        ? [
            "The overall standard appeared professional and carefully managed.",
            "The environment inspired confidence through its cleanliness and organization.",
            "The service reflected a serious and professional approach.",
          ]
        : [
            "The overall standard was reasonable, although there is room for stronger organization.",
          ],

      service: positive
        ? [
            "The staff were respectful and professional.",
            "Communication was clear and courteous.",
            "The team handled questions patiently.",
          ]
        : [
            "The staff were courteous, although communication could have been more proactive.",
          ],

      atmosphere: [
        "The environment was clean, calm, and appropriately maintained.",
        "The overall setting felt orderly and professional.",
        "The atmosphere was reassuring rather than unnecessarily stressful.",
      ],

      transitions: [
        "One thing I appreciated was",
        "Another aspect worth mentioning is",
        "Beyond the main service,",
        "I also noticed that",
      ],

      endings: positive
        ? [
            "Overall, I was satisfied with my experience at {business}.",
            "I would be comfortable recommending {business} based on my experience.",
            "The overall service left a favourable impression.",
          ]
        : [
            "I hope these areas are improved so future visitors have a smoother experience.",
            "Better organization and communication would make a noticeable difference.",
          ],
    };
  }

  return {
    topics: [
      "service",
      "staff",
      "quality",
      "cleanliness",
      "atmosphere",
      "professionalism",
      "value",
      "overall experience",
    ],

    openings: positive
      ? [
          "I had a genuinely pleasant experience at {business}.",
          "My experience at {business} was positive overall.",
          "I recently visited {business} and came away with a good impression.",
          "There was a lot to appreciate about my experience at {business}.",
          "I was pleased with the overall standard at {business}.",
          "My visit to {business} was comfortable and well managed.",
        ]
      : [
          "My experience at {business} was mixed.",
          "I visited {business} recently and felt that several areas could be improved.",
          "There were some positive aspects to my experience at {business}, although consistency could be better.",
        ],

    observations: positive
      ? [
          "The staff were courteous and professional.",
          "The overall service was efficient and reasonably attentive.",
          "The quality was consistent and clearly reflected attention to detail.",
          "The environment was clean, comfortable, and well maintained.",
          "The overall experience felt thoughtfully managed.",
          "The team was approachable and willing to assist.",
        ]
      : [
          "The staff were polite, although the service could have been more consistent.",
          "The quality was acceptable, but some aspects lacked attention to detail.",
          "The environment was reasonable, although maintenance could be improved.",
        ],

    quality: positive
      ? [
          "There was a noticeable level of care in the way the service was delivered.",
          "The overall standard felt dependable.",
          "The experience demonstrated a good level of professionalism.",
          "The attention to detail was one of the stronger aspects.",
        ]
      : [
          "The overall standard was acceptable but not especially consistent.",
          "More attention to detail would improve the experience considerably.",
        ],

    service: positive
      ? [
          "The team communicated clearly and respectfully.",
          "Service was handled in a professional manner.",
          "The staff were friendly without being intrusive.",
          "Requests were dealt with efficiently.",
        ]
      : [
          "Communication could have been clearer.",
          "The staff were courteous, although responsiveness could be improved.",
        ],

    atmosphere: [
      "The environment was comfortable and reasonably well maintained.",
      "The atmosphere was pleasant and easy to settle into.",
      "The setting felt clean, organized, and welcoming.",
    ],

    transitions: [
      "What I particularly appreciated was",
      "Another aspect that stood out was",
      "Beyond the main service,",
      "I also liked that",
      "One detail worth mentioning is",
    ],

    endings: positive
      ? [
          "I would happily return to {business}.",
          "I would recommend {business} based on my experience.",
          "Overall, {business} left a favourable impression.",
          "I would be comfortable visiting again.",
        ]
      : [
          "I hope the business takes the feedback constructively and improves these areas.",
          "There is potential here, but stronger consistency would make the experience considerably better.",
        ],
  };
}

function replaceBusiness(text: string, businessName: string) {
  return text
    .replaceAll("{business}", businessName)
    .replaceAll("{business.", `${businessName}.`);
}


const nepaliTopicNames: Record<string, string> = {
  food: "खाना",
  taste: "स्वाद",
  presentation: "प्रस्तुति",
  service: "सेवा",
  staff: "स्टाफ",
  cleanliness: "सरसफाइ",
  ambience: "वातावरण",
  "portion size": "परिकारको मात्रा",
  "menu variety": "मेनुको विविधता",
  "value for money": "मूल्यअनुसारको सेवा",
  room: "कोठा",
  bed: "ओछ्यान",
  hospitality: "आतिथ्य",
  reception: "रिसेप्सन सेवा",
  breakfast: "ब्रेकफास्ट",
  location: "स्थान",
  facilities: "सुविधा",
  comfort: "आराम",
  haircut: "हेयरकट",
  styling: "स्टाइलिङ",
  consultation: "परामर्श",
  "staff behaviour": "स्टाफको व्यवहार",
  "attention to detail": "विवरणमा ध्यान",
  "product quality": "सामानको गुणस्तर",
  "final result": "अन्तिम नतिजा",
  professionalism: "व्यावसायिकता",
  value: "मूल्य",
  itinerary: "यात्रा योजना",
  communication: "सम्पर्क तथा जानकारी",
  guide: "गाइड",
  transport: "यातायात व्यवस्था",
  organization: "व्यवस्थापन",
  timing: "समय व्यवस्थापन",
  planning: "योजना",
  "overall coordination": "समग्र समन्वय",
  "product variety": "सामानको विविधता",
  availability: "सामानको उपलब्धता",
  pricing: "मूल्य",
  "convenience": "सहजता",
  coffee: "कफी",
  desserts: "डेजर्ट",
  "overall service": "समग्र सेवा",
  quality: "गुणस्तर",
  atmosphere: "वातावरण",
};

function nepaliTopics(items: string[]) {
  return items.map((item) => nepaliTopicNames[item.toLowerCase()] || item).join(" र ");
}

function buildNepaliReview(
  businessName: string,
  businessType: string,
  rating: number,
  style: ReviewStyle,
  selectedTopics: string[],
  details: string
) {
  const normalized = normalizeBusinessType(businessType);
  const positive = rating >= 3;
  const topics = selectedTopics.length
    ? nepaliTopics(selectedTopics)
    : "समग्र सेवा";

  const detail = details.trim()
    ? `विशेष रूपमा, ${details.trim().replace(/[.!?]+$/, "")}।`
    : "";

  const commonEndings = positive
    ? [
        "फेरि पनि यहाँ आउने इच्छा छ।",
        "अरूलाई पनि यो ठाउँ सिफारिस गर्न सक्छु।",
        "समग्रमा निकै राम्रो अनुभव रह्यो।",
        "आगामी दिनमा पनि फेरि आउनेछु।",
      ]
    : [
        "यी पक्षमा सुधार भए अनुभव अझ राम्रो हुन सक्छ।",
        "आशा छ, यो प्रतिक्रियालाई सुधारका लागि उपयोग गरिनेछ।",
        "सुधारका लागि केही ध्यान दिनुपर्ने ठाउँ देखिन्छ।",
      ];

  let opening = "";
  let observations: string[] = [];
  let quality = "";
  let service = "";

  if (normalized === "restaurant") {
    opening = positive
      ? pick([
          `${businessName} मा मेरो अनुभव निकै राम्रो रह्यो।`,
          `${businessName} मा गएर खाना र सेवाको राम्रो अनुभव भयो।`,
          `${businessName} ले समग्रमा सकारात्मक प्रभाव पार्यो।`,
          `धेरै समयदेखि ${businessName} जाने सोच थियो, अन्ततः गएर राम्रो अनुभव भयो।`,
        ])
      : pick([
          `${businessName} मा मेरो अनुभव अपेक्षाअनुसार रहेन।`,
          `${businessName} मा केही कुरा राम्रो भए पनि केही पक्षमा सुधार आवश्यक देखियो।`,
        ]);
    observations = positive
      ? [
          "खाना स्वादिलो र राम्रोसँग तयार गरिएको थियो।",
          "परिकारको प्रस्तुति र गुणस्तरमा राम्रो ध्यान दिएको देखिन्थ्यो।",
          "स्टाफ मिलनसार र सहयोगी थिए।",
          "वातावरण सफा, सहज र आरामदायी थियो।",
          "सेवा धेरै ढिलो नहुँदा खाना आरामसँग आनन्द लिन सकियो।",
        ]
      : [
          "खानाको गुणस्तर केही ठाउँमा असंगत लाग्यो।",
          "सेवामा केही ढिलाइ र समन्वयको कमी देखियो।",
          "सरसफाइ र व्यवस्थापनमा अझ ध्यान दिन सकिन्छ।",
        ];
    quality = positive ? "खाना ताजा र ध्यान दिएर तयार गरिएको महसुस भयो।" : "खानाको गुणस्तरमा अझ निरन्तरता आवश्यक देखियो।";
    service = positive ? "स्टाफको व्यवहार नम्र र व्यावसायिक थियो।" : "स्टाफ नम्र थिए, तर सेवा अझ छिटो र व्यवस्थित हुन सक्थ्यो।";
  } else if (normalized === "hotel" || normalized === "lodge") {
    opening = positive
      ? pick([
          `${businessName} मा बसाइ निकै आरामदायी रह्यो।`,
          `${businessName} मा मेरो बसाइको अनुभव समग्रमा निकै राम्रो भयो।`,
          `बसाइदेखि सेवासम्म ${businessName} ले राम्रो प्रभाव पार्यो।`,
        ])
      : pick([
          `${businessName} मा मेरो बसाइ मिश्रित अनुभव रह्यो।`,
          `${businessName} मा केही राम्रो पक्ष थिए, तर केही सुधार आवश्यक देखियो।`,
        ]);
    observations = positive
      ? [
          "कोठा सफा, आरामदायी र राम्रोसँग तयार गरिएको थियो।",
          "स्टाफ मिलनसार र सहयोगी थिए।",
          "स्थान धेरै कुराका लागि सुविधाजनक लाग्यो।",
          "समग्र वातावरण शान्त र आरामदायी थियो।",
          "सुविधाहरू राम्रो अवस्थामा रहेको महसुस भयो।",
        ]
      : [
          "कोठाको सरसफाइ र मर्मतसम्भारमा अझ ध्यान दिन सकिन्छ।",
          "सेवा ठीक थियो, तर केही समयमा अपेक्षा गरेभन्दा ढिलो भयो।",
          "समग्र व्यवस्थापन अझ व्यवस्थित हुन सक्थ्यो।",
        ];
    quality = positive ? "समग्रमा व्यवस्थापन र सरसफाइमा राम्रो ध्यान दिएको देखियो।" : "मर्मतसम्भार र सेवाको निरन्तरतामा सुधार गर्न सकिन्छ।";
    service = positive ? "रिसेप्सन र अन्य स्टाफको व्यवहार नम्र थियो।" : "स्टाफ नम्र भए पनि सेवा अझ सक्रिय र छिटो हुन सक्थ्यो।";
  } else if (normalized === "salon") {
    opening = positive
      ? pick([
          `${businessName} मा मेरो अनुभव निकै सन्तोषजनक रह्यो।`,
          `${businessName} मा सेवा लिएपछि नतिजाबाट म खुसी भएँ।`,
          `${businessName} मा व्यावसायिक र सहज सेवा पाएँ।`,
        ])
      : pick([
          `${businessName} मा मेरो अनुभव मिश्रित रह्यो।`,
          `सेवा ठीक भए पनि ${businessName} मा केही पक्ष अझ राम्रो हुन सक्थे।`,
        ]);
    observations = positive
      ? [
          "हेयरकट र स्टाइलिङमा राम्रो ध्यान दिएको देखियो।",
          "मेरो चाहना ध्यान दिएर बुझेर सेवा दिइयो।",
          "स्टाफको व्यवहार नम्र र सहज थियो।",
          "सलुन सफा र व्यवस्थित थियो।",
          "अन्तिम नतिजा मैले अपेक्षा गरेअनुसार नै आयो।",
        ]
      : [
          "सेवा सुरु गर्नुअघि मेरो चाहना अझ स्पष्ट रूपमा बुझ्न सकिन्थ्यो।",
          "अन्तिम नतिजामा अझ बढी ध्यान दिन सकिन्थ्यो।",
          "सलुनको व्यवस्थापन र सेवाको गति अझ राम्रो हुन सक्छ।",
        ];
    quality = positive ? "काममा विवरण र फिनिसिङमा राम्रो ध्यान दिइएको थियो।" : "फिनिसिङ र विवरणमा अझ ध्यान दिन सकिन्छ।";
    service = positive ? "स्टाफ धैर्यवान र सहयोगी थिए।" : "स्टाफको व्यवहार ठीक थियो, तर संवाद अझ स्पष्ट हुन सक्थ्यो।";
  } else if (normalized === "travel") {
    opening = positive
      ? pick([
          `${businessName} मार्फतको यात्रा अनुभव निकै राम्रो रह्यो।`,
          `${businessName} ले यात्राको व्यवस्थापन राम्रोसँग गरेको महसुस भयो।`,
          `यात्राको योजना र समन्वयका कारण ${businessName} सँगको अनुभव सहज भयो।`,
        ])
      : pick([
          `${businessName} मार्फतको मेरो यात्रा अनुभव मिश्रित रह्यो।`,
          `यात्रा ठीक भए पनि केही व्यवस्थापन पक्ष सुधार गर्न सकिन्छ।`,
        ]);
    observations = positive
      ? [
          "यात्रा योजना व्यवस्थित र बुझ्न सजिलो थियो।",
          "सम्पर्क र जानकारी समयमै प्राप्त भयो।",
          "यातायातको व्यवस्था सहज रूपमा मिलाइएको थियो।",
          "स्टाफ र गाइड सहयोगी तथा जानकार थिए।",
          "समय व्यवस्थापन राम्रो भएको महसुस भयो।",
        ]
      : [
          "केही जानकारी अझ पहिले र स्पष्ट रूपमा दिन सकिन्थ्यो।",
          "यातायात र समय व्यवस्थापनमा केही असहजता भयो।",
          "समन्वय अझ राम्रो भए यात्रा अनुभव सहज हुने थियो।",
        ];
    quality = positive ? "यात्राको व्यवस्थापनमा राम्रो योजना र तयारी देखियो।" : "योजना र समन्वयमा अझ निरन्तरता आवश्यक देखियो।";
    service = positive ? "टोली सहयोगी र सम्पर्क गर्न सहज थियो।" : "टोली नम्र थियो, तर केही जानकारी अझ सक्रिय रूपमा दिन सकिन्थ्यो।";
  } else if (normalized === "shop" || normalized === "kirana" || normalized === "pharmacy") {
    opening = positive
      ? pick([
          `${businessName} मा किनमेलको अनुभव निकै राम्रो रह्यो।`,
          `${businessName} दैनिक आवश्यकताका सामानका लागि राम्रो विकल्प लाग्यो।`,
          `${businessName} मा सेवा र सामानको उपलब्धता राम्रो पाएँ।`,
        ])
      : pick([
          `${businessName} मा मेरो अनुभव ठीकठाक भए पनि केही सुधार आवश्यक देखियो।`,
          `${businessName} मा केही कुरा राम्रो थिए, तर सेवा अझ व्यवस्थित हुन सक्छ।`,
        ]);
    observations = positive
      ? [
          "आवश्यक सामानहरू सजिलै भेटिए।",
          "सामानको विविधता राम्रो थियो।",
          "स्टाफ सहयोगी र नम्र थिए।",
          "मूल्यहरू उचित लागे।",
          "पसल सफा र व्यवस्थित थियो।",
        ]
      : [
          "केही आवश्यक सामान उपलब्ध थिएनन्।",
          "सेवा अपेक्षा गरेभन्दा केही ढिलो भयो।",
          "सामानको व्यवस्थापन र विविधतामा अझ सुधार गर्न सकिन्छ।",
        ];
    quality = positive ? "सामानहरू राम्रो अवस्थामा र व्यवस्थित रूपमा राखिएका थिए।" : "सामानको उपलब्धता र गुणस्तरमा अझ निरन्तरता आवश्यक देखियो।";
    service = positive ? "स्टाफले आवश्यक सहयोग सहज रूपमा गरे।" : "स्टाफ नम्र थिए, तर सेवा अझ छिटो हुन सक्थ्यो।";
  } else if (normalized === "cafe") {
    opening = positive
      ? pick([
          `${businessName} मा समय बिताउन निकै रमाइलो लाग्यो।`,
          `${businessName} मा कफी र वातावरण दुवै मन पर्यो।`,
          `${businessName} को समग्र अनुभव आरामदायी र राम्रो रह्यो।`,
        ])
      : pick([
          `${businessName} मा मेरो अनुभव मिश्रित रह्यो।`,
          `केही कुरा राम्रो भए पनि ${businessName} मा सेवा अझ राम्रो हुन सक्थ्यो।`,
        ]);
    observations = positive
      ? [
          "कफी राम्रोसँग तयार गरिएको र स्वादिलो थियो।",
          "खाना ताजा र राम्रोसँग प्रस्तुत गरिएको थियो।",
          "वातावरण शान्त र आरामदायी थियो।",
          "स्टाफ मिलनसार र सहयोगी थिए।",
          "ठाउँ सफा र बस्न सहज थियो।",
        ]
      : [
          "कफी ठीक थियो, तर गुणस्तरमा अझ निरन्तरता चाहिन्छ।",
          "वातावरण राम्रो भए पनि सेवामा केही ढिलाइ भयो।",
          "खाना ठीक थियो, तर प्रस्तुति अझ राम्रो हुन सक्थ्यो।",
        ];
    quality = positive ? "तयारीमा राम्रो ध्यान दिएको महसुस भयो।" : "गुणस्तरमा अझ निरन्तरता भए अनुभव राम्रो हुने थियो।";
    service = positive ? "स्टाफको व्यवहार न्यानो र नम्र थियो।" : "स्टाफ नम्र थिए, तर सेवा अझ छिटो हुन सक्थ्यो।";
  } else {
    opening = positive
      ? pick([
          `${businessName} मा मेरो अनुभव समग्रमा निकै राम्रो रह्यो।`,
          `${businessName} मा गएर सकारात्मक अनुभव भयो।`,
          `${businessName} ले राम्रो प्रभाव पार्यो।`,
        ])
      : pick([
          `${businessName} मा मेरो अनुभव मिश्रित रह्यो।`,
          `${businessName} मा केही पक्ष राम्रो भए पनि सुधारका ठाउँ देखिए।`,
        ]);
    observations = positive
      ? [
          "सेवा सहज र व्यवस्थित थियो।",
          "स्टाफ नम्र र सहयोगी थिए।",
          "वातावरण सफा र आरामदायी थियो।",
          "समग्र गुणस्तरमा राम्रो ध्यान दिएको देखियो।",
          "व्यवस्थापन व्यावसायिक लाग्यो।",
        ]
      : [
          "सेवा ठीक थियो, तर अझ व्यवस्थित हुन सक्थ्यो।",
          "गुणस्तरमा केही असंगतता देखियो।",
          "व्यवस्थापन र विवरणमा अझ ध्यान दिन सकिन्छ।",
        ];
    quality = positive ? "समग्र सेवामा राम्रो स्तरको ध्यान देखियो।" : "समग्र गुणस्तरमा अझ निरन्तरता आवश्यक देखियो।";
    service = positive ? "स्टाफसँग कुराकानी गर्न सहज थियो।" : "स्टाफ नम्र थिए, तर प्रतिक्रिया र सेवा अझ छिटो हुन सक्थ्यो।";
  }

  const count = style === "short" ? 1 : style === "natural" ? 2 : 3;
  const chosen = pickManyNepali(observations, count);

  const parts = [
    opening,
    `${topics} विशेष रूपमा राम्रो लाग्यो।`,
    ...chosen,
    detail,
    style === "detailed" ? quality : "",
    style !== "short" ? service : "",
    pick(commonEndings),
  ];

  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

function pickManyNepali(items: string[], count: number) {
  const copy = [...items];
  const out: string[] = [];
  while (copy.length && out.length < count) {
    const index = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(index, 1)[0]);
  }
  return out;
}

function buildReview(
  businessName: string,
  businessType: string,
  rating: number,
  style: ReviewStyle,
  selectedTopics: string[],
  details: string
) {
  const profile = getReviewProfile(businessType, rating);
  const ratingInfo = getRatingLanguage(rating);

  const name = businessName.trim() || "the business";
  const topicPool =
    selectedTopics.length > 0
      ? selectedTopics
      : profile.topics;

  const selected =
    topicPool.length <= 3
      ? [...topicPool]
      : [
          pick(topicPool),
          pick(topicPool),
          pick(topicPool),
        ].filter(
          (item, index, array) => array.indexOf(item) === index
        );

  const opening = replaceBusiness(pick(profile.openings), name);

  const observations = selected
    .map(() => pick(profile.observations))
    .filter(
      (sentence, index, array) => array.indexOf(sentence) === index
    )
    .slice(0, style === "short" ? 2 : style === "natural" ? 3 : 5);

  const qualitySentence = pick(profile.quality);
  const serviceSentence = pick(profile.service);

  const topicSentence =
    selected.length > 0
      ? `The aspects that stood out to me were ${formatList(
          selected
        )}.`
      : "";

  const detailSentence = details.trim()
    ? `In particular, ${details.trim().replace(/[.!?]+$/, "")}.`
    : "";

  const transition = pick(profile.transitions);

  let reviewParts: string[] = [];

  if (ratingInfo.tone === "critical") {
    reviewParts = [
      opening,
      topicSentence,
      ...observations.slice(0, 2),
      detailSentence,
      `I hope the team can address these areas and make the experience more consistent.`,
    ];
  } else if (ratingInfo.tone === "mixed") {
    reviewParts = [
      opening,
      topicSentence,
      observations[0] || "",
      detailSentence,
      `${transition} ${qualitySentence.charAt(0).toLowerCase()}${qualitySentence.slice(
        1
      )}`,
      serviceSentence,
      "There is a good foundation here, although consistency could be improved.",
    ];
  } else if (style === "short") {
    reviewParts = [
      opening,
      topicSentence,
      observations[0] || "",
      detailSentence,
      replaceBusiness(pick(profile.endings), name),
    ];
  } else if (style === "natural") {
    reviewParts = [
      opening,
      topicSentence,
      observations[0] || "",
      observations[1] || "",
      detailSentence,
      serviceSentence,
      replaceBusiness(pick(profile.endings), name),
    ];
  } else {
    reviewParts = [
      opening,
      topicSentence,
      observations[0] || "",
      observations[1] || "",
      `${transition} ${qualitySentence.charAt(0).toLowerCase()}${qualitySentence.slice(
        1
      )}`,
      observations[2] || "",
      serviceSentence,
      observations[3] || "",
      detailSentence,
      replaceBusiness(pick(profile.endings), name),
    ];
  }

  return reviewParts
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function AIReviewAssistant({
  businessName,
  businessType,
  rating,
}: Props) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [language, setLanguage] = useState<ReviewLanguage>("english");
  const [details, setDetails] = useState("");
  const [result, setResult] = useState("");
  const [style, setStyle] = useState<ReviewStyle>("natural");
  const [copied, setCopied] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  const profile = useMemo(
    () => getReviewProfile(businessType, rating),
    [businessType, rating]
  );

  const topics = profile.topics;

  function toggleTopic(topic: string) {
    setSelectedTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic]
    );

    setResult("");
    setCopied(false);
  }

  function createReview() {
    if (rating === 0) {
      setResult(
        `Please select a star rating first so we can create a review that matches your experience at ${businessName}.`
      );
      return;
    }

    const review =
      language === "nepali"
        ? buildNepaliReview(
            businessName,
            businessType,
            rating,
            style,
            selectedTopics,
            details
          )
        : buildReview(
            businessName,
            businessType,
            rating,
            style,
            selectedTopics,
            details
          );

    setResult(review);
    setCopied(false);
    setGeneratedCount((count) => count + 1);
  }

  async function copyReview() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Please copy the review manually.");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-3 text-sm font-semibold text-[#26352c]">
          Review language / समीक्षाको भाषा
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setLanguage("english");
              setResult("");
              setCopied(false);
            }}
            className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
              language === "english"
                ? "bg-[#1f4a31] text-white shadow-sm"
                : "border border-[#d8e0d8] bg-white text-[#5c6a61]"
            }`}
          >
            English 🇬🇧
          </button>

          <button
            type="button"
            onClick={() => {
              setLanguage("nepali");
              setResult("");
              setCopied(false);
            }}
            className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
              language === "nepali"
                ? "bg-[#1f4a31] text-white shadow-sm"
                : "border border-[#d8e0d8] bg-white text-[#5c6a61]"
            }`}
          >
            नेपाली 🇳🇵
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#26352c]">
              {language === "nepali" ? "आफ्नो अनुभव मिलाउनुहोस्" : "Personalize your experience"}
            </p>

            <p className="mt-1 text-xs leading-5 text-[#718078]">
              {language === "nepali"
                ? "तपाईंको वास्तविक अनुभवमा विशेष लागेका कुराहरू छान्नुहोस्।"
                : "Choose the areas that genuinely stood out during your visit."}
            </p>
          </div>

          {businessType && (
            <span className="rounded-full border border-[#d8e0d8] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#587064]">
              {businessType}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {topics.map((topic) => {
            const selected = selectedTopics.includes(topic);

            return (
              <button
                key={topic}
                type="button"
                onClick={() => toggleTopic(topic)}
                className={`rounded-full border px-4 py-2.5 text-sm font-medium capitalize transition ${
                  selected
                    ? "border-[#1f4a31] bg-[#1f4a31] text-white shadow-sm"
                    : "border-[#d8e0d8] bg-white text-[#526057] hover:border-[#1f4a31] hover:bg-[#f7faf7]"
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#26352c]">
          {language === "nepali" ? "समीक्षाको लम्बाइ" : "Review length"}
        </p>

        <div className="grid grid-cols-3 gap-2">
          {(["short", "natural", "detailed"] as ReviewStyle[]).map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setStyle(item);
                  setResult("");
                  setCopied(false);
                }}
                className={`rounded-xl px-3 py-3 text-sm font-semibold capitalize transition ${
                  style === item
                    ? "bg-[#1f4a31] text-white shadow-sm"
                    : "border border-[#d8e0d8] bg-white text-[#5c6a61] hover:border-[#1f4a31]"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>

      <div>
        <div className="mb-3">
          <p className="text-sm font-semibold text-[#26352c]">
            {language === "nepali" ? "आफ्नो विवरण थप्नुहोस्" : "Add your own details"}
          </p>

          <p className="mt-1 text-xs leading-5 text-[#718078]">
            {language === "nepali"
              ? "तपाईंले वास्तवमै अनुभव गर्नुभएको कुनै विशेष कुरा लेख्नुहोस्।"
              : "Mention something specific you experienced. The generator will incorporate it into the review."}
          </p>
        </div>

        <textarea
          value={details}
          onChange={(event) => {
            setDetails(event.target.value);
            setResult("");
            setCopied(false);
          }}
          placeholder={
            language === "nepali"
              ? "उदाहरण: स्टाफ मिलनसार थियो र खाना निकै स्वादिलो थियो।"
              : "Example: The waiter recommended the local special and it was excellent."
          }
          className="min-h-[115px] w-full rounded-2xl border border-[#d8e0d8] bg-white p-4 text-sm leading-6 text-[#26352c] outline-none placeholder:text-[#9aa59d] focus:border-[#1f4a31] focus:ring-2 focus:ring-[#1f4a31]/10"
        />
      </div>

      <button
        type="button"
        onClick={createReview}
        className="w-full rounded-2xl bg-[#1f4a31] px-5 py-4 font-bold text-white shadow-sm transition hover:bg-[#163a25] active:scale-[0.99]"
      >
        Generate My Review
      </button>

      {generatedCount > 0 && result && (
        <div className="rounded-2xl border border-[#d8e0d8] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5f7a68]">
                {language === "nepali" ? "तपाईंको समीक्षा" : "Your review draft"}
              </p>

              <p className="mt-1 text-xs text-[#8a958e]">
                {language === "nepali"
                  ? `${businessName} का लागि तयार गरिएको मस्यौदा`
                  : `Created specifically for ${businessName}`}
              </p>
            </div>

            <span className="rounded-full bg-[#f0f5f1] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#55705e]">
              {style}
            </span>
          </div>

          <textarea
            value={result}
            onChange={(event) => {
              setResult(event.target.value);
              setCopied(false);
            }}
            className="mt-4 min-h-[180px] w-full rounded-xl border border-[#e1e7e1] bg-[#fafcf9] p-4 text-sm leading-7 text-[#26352c] outline-none focus:border-[#1f4a31] focus:ring-2 focus:ring-[#1f4a31]/10"
          />

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={createReview}
              className="rounded-xl border border-[#d8e0d8] bg-[#f7faf7] py-3 text-sm font-semibold text-[#314137] transition hover:bg-[#eef4ef]"
            >
              {language === "nepali" ? "अर्को संस्करण" : "Another Version"}
            </button>

            <button
              type="button"
              onClick={copyReview}
              className="rounded-xl bg-[#1f4a31] py-3 text-sm font-semibold text-white transition hover:bg-[#163a25]"
            >
              {copied
                ? language === "nepali" ? "Copy भयो!" : "Copied!"
                : language === "nepali" ? "समीक्षा Copy गर्नुहोस्" : "Copy Review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}