'use client';

import React from 'react';
import TravelGuideArticleTemplate from '@/components/TravelGuideArticleTemplate';

export default function RaftingJinjaPage() {
  const articleData = {
    id: 'rafting-jinja',
    title: 'White Water Rafting in Jinja: The Ultimate Adventure Guide',
    subtitle: 'Conquer the legendary rapids of the Nile River with expert safety tips and insider knowledge',
    description: 'Complete guide to white water rafting at the source of the Nile River in Jinja, Uganda. Safety information, best seasons, gear requirements, and what to expect.',
    heroImages: [
      {
        src: '/images/rafting-hero-1.jpg',
        alt: 'White water rafting on the Nile River',
        caption: 'Navigating the mighty Nile rapids'
      },
      {
        src: '/images/rafting-hero-2.jpg',
        alt: 'Rafting team celebrating in Jinja',
        caption: 'Victory after conquering Grade 5 rapids'
      },
      {
        src: '/images/rafting-hero-3.jpg',
        alt: 'Source of the Nile panoramic view',
        caption: 'The legendary source of the River Nile'
      },
      {
        src: '/images/rafting-hero-4.jpg',
        alt: 'Safety briefing before rafting',
        caption: 'Professional safety briefing and gear fitting'
      }
    ],
    metadata: {
      author: 'Adventure Sports Team',
      publishDate: '2024-03-12',
      readTime: '15 min read',
      category: 'Adventure Guide',
      tags: ['White Water Rafting', 'Jinja', 'Nile River', 'Adventure Sports', 'Water Sports', 'Source of the Nile']
    },
    tableOfContents: [
      { id: 'introduction', title: 'Introduction to Nile Rafting', level: 1 },
      { id: 'why-jinja', title: 'Why Jinja is Special', level: 1 },
      { id: 'rapids-classification', title: 'Understanding Rapids Classification', level: 1 },
      { id: 'safety-first', title: 'Safety First: Essential Guidelines', level: 1 },
      { id: 'best-time', title: 'Best Time for Rafting', level: 1 },
      { id: 'choosing-operator', title: 'Choosing Your Rafting Operator', level: 1 },
      { id: 'physical-requirements', title: 'Physical Requirements', level: 1 },
      { id: 'what-to-bring', title: 'What to Bring', level: 1 },
      { id: 'rafting-day', title: 'Your Rafting Day Experience', level: 1 },
      { id: 'safety-briefing', title: 'Safety Briefing Details', level: 2 },
      { id: 'river-sections', title: 'River Sections and Rapids', level: 2 },
      { id: 'emergency-procedures', title: 'Emergency Procedures', level: 2 },
      { id: 'photography-options', title: 'Photography and Video Options', level: 1 },
      { id: 'after-rafting', title: 'After Your Rafting Adventure', level: 1 },
      { id: 'other-activities', title: 'Other Jinja Activities', level: 1 }
    ],
    sections: [
      {
        id: 'introduction',
        title: 'Introduction to Nile Rafting',
        content: `
          <p>Jinja, Uganda, offers some of the world's most thrilling white water rafting experiences at the legendary source of the River Nile. This adventure combines breathtaking natural beauty with heart-pounding rapids, creating memories that last a lifetime.</p>
          
          <p>The Nile River begins its 6,650-kilometer journey to the Mediterranean Sea right here in Jinja, flowing out of Lake Victoria with tremendous power and energy. The rapids created by this mighty river offer various difficulty levels, from gentle Grade 2 flows perfect for beginners to challenging Grade 5 rapids that test even experienced rafters.</p>
          
          <p>What makes Jinja special isn't just the world-class rapids – it's the combination of adventure, history, and natural beauty. You're not just rafting; you're experiencing one of the world's most significant geographical landmarks while supporting sustainable adventure tourism.</p>
          
          <blockquote>
            <p>"The Nile at Jinja offers some of the most consistent and exciting rapids in the world. Every trip is an adventure, but safety and professionalism always come first." - International Rafting Federation</p>
          </blockquote>
        `
      },
      {
        id: 'why-jinja',
        title: 'Why Jinja is Special',
        content: `
          <p>Jinja stands out among the world's rafting destinations for several unique reasons that combine geography, history, and adventure.</p>
          
          <h3>The Source of the Nile</h3>
          <p>You're rafting on the legendary Nile River at its very beginning. This isn't just any river – it's the longest river in the world, and you're experiencing its birth from Lake Victoria. The historical and geographical significance adds a profound dimension to your adventure.</p>
          
          <h3>Consistent Water Levels</h3>
          <p>Unlike many rafting destinations that depend on seasonal rains or dam releases, the Nile maintains relatively consistent water levels year-round thanks to Lake Victoria's massive water reservoir. This means reliable rafting conditions throughout most of the year.</p>
          
          <h3>World-Class Rapids Variety</h3>
          <p>The Nile near Jinja offers an exceptional variety of rapids within a relatively short stretch:</p>
          <ul>
            <li><strong>Big Brother (Grade 4):</strong> Technical and powerful</li>
            <li><strong>Bubugo (Grade 5):</strong> The most challenging commercial rapid</li>
            <li><strong>Silverback (Grade 4):</strong> Long, sustained action</li>
            <li><strong>Nile Special (Grade 5):</strong> Technical complexity with massive hydraulics</li>
            <li><strong>G-Spot (Grade 4):</strong> Fun and forgiving</li>
          </ul>
          
          <h3>Ideal Climate for Year-Round Adventure</h3>
          <p>Uganda's location straddling the equator creates perfect conditions for water sports throughout the year. Unlike many rafting destinations where you need thick wetsuits and face uncomfortably cold conditions, Jinja's warm tropical climate makes every day feel like perfect rafting weather. Even during the "cooler" months, air temperatures rarely drop below 20°C (68°F), and the water remains refreshingly comfortable.</p>
          
          <p>This consistent warmth means you can focus entirely on the rafting experience without worrying about staying warm or dealing with cumbersome cold-weather gear. The tropical setting also creates a vacation atmosphere that enhances the entire experience – there's something special about tackling world-class rapids while surrounded by lush green vegetation and warm sunshine.</p>
          
          <h3>A Complete Cultural and Adventure Destination</h3>
          <p>What truly sets Jinja apart is that it offers far more than just exceptional rafting. The town serves as East Africa's adventure capital, with activities ranging from bungee jumping and kayaking to cultural visits and historical explorations. This variety means you can easily spend a week here without running out of exciting things to do.</p>
          
          <p>The local community in Jinja has embraced adventure tourism while maintaining their authentic Ugandan culture. You'll find friendly, welcoming people who take genuine pride in sharing their river and their town with visitors. Many of the guides and operators are local entrepreneurs who've built successful businesses around their intimate knowledge of the Nile, creating a sustainable tourism model that benefits the entire community.</p>
        `
      },
      {
        id: 'rapids-classification',
        title: 'Understanding Rapids Classification',
        content: `
          <p>Rapids are classified on an international scale from Grade 1 (easiest) to Grade 6 (nearly impossible). Understanding this system helps you choose appropriate trips and set realistic expectations.</p>
          
          <h3>International Rapids Classification</h3>
          
          <div class="rapids-grid">
            <div class="rapids-card grade-1">
              <h4>Grade 1 - Easy</h4>
              <p><strong>Characteristics:</strong> Moving water with few riffles, small waves. Risk to swimmers is slight.</p>
              <p><strong>Skills Required:</strong> Basic paddling</p>
              <p><strong>Jinja Example:</strong> Launch area flows</p>
            </div>
            
            <div class="rapids-card grade-2">
              <h4>Grade 2 - Novice</h4>
              <p><strong>Characteristics:</strong> Straightforward rapids with wide, clear channels. Occasional maneuvering required.</p>
              <p><strong>Skills Required:</strong> Basic boat handling</p>
              <p><strong>Jinja Example:</strong> Warm-up rapids</p>
            </div>
            
            <div class="rapids-card grade-3">
              <h4>Grade 3 - Intermediate</h4>
              <p><strong>Characteristics:</strong> Rapids with irregular waves, strong currents, and narrow passages requiring precise maneuvering.</p>
              <p><strong>Skills Required:</strong> Good boat control and teamwork</p>
              <p><strong>Jinja Example:</strong> Many of the middle section rapids</p>
            </div>
            
            <div class="rapids-card grade-4">
              <h4>Grade 4 - Advanced</h4>
              <p><strong>Characteristics:</strong> Intense, powerful, and unpredictable rapids requiring precise boat handling in turbulent water.</p>
              <p><strong>Skills Required:</strong> Expert paddling and quick decision-making</p>
              <p><strong>Jinja Example:</strong> Big Brother, Silverback, G-Spot</p>
            </div>
            
            <div class="rapids-card grade-5">
              <h4>Grade 5 - Expert</h4>
              <p><strong>Characteristics:</strong> Extremely long, obstructed, or violent rapids with complex routes and significant hazard potential.</p>
              <p><strong>Skills Required:</strong> Expert skills and extensive experience</p>
              <p><strong>Jinja Example:</strong> Bubugo, Nile Special</p>
            </div>
            
            <div class="rapids-card grade-6">
              <h4>Grade 6 - Nearly Impossible</h4>
              <p><strong>Characteristics:</strong> Runs that have almost never been attempted and exemplify the extremes of difficulty.</p>
              <p><strong>Skills Required:</strong> Expert skills with acceptance of substantial risk</p>
              <p><strong>Jinja Example:</strong> Not commercially run</p>
            </div>
          </div>
          
          <h3>Jinja Rapids Overview</h3>
          <p>The typical full-day Jinja rafting experience includes approximately 8-12 rapids ranging from Grade 3 to Grade 5, with plenty of calm water between them for rest, swimming, and enjoying the scenery.</p>
          
          <div class="important-note">
            <h4>💡 Important Note</h4>
            <p>Rapids classifications can change based on water levels, recent weather, and seasonal variations. Always listen to current briefings from your guides, as they know the river's current conditions better than any guidebook.</p>
          </div>
        `
      },
      {
        id: 'safety-first',
        title: 'Safety First: Essential Guidelines',
        content: `
          <p>White water rafting, while thrilling, involves inherent risks. Professional operators in Jinja maintain excellent safety records through rigorous training, quality equipment, and comprehensive safety protocols.</p>
          
          <h3>Professional Safety Standards</h3>
          <ul>
            <li><strong>International Certification:</strong> All guides are certified by international rafting associations</li>
            <li><strong>First Aid Training:</strong> Guides maintain current wilderness first aid and CPR certifications</li>
            <li><strong>Equipment Standards:</strong> Regular inspection and replacement of all safety equipment</li>
            <li><strong>Safety Kayakers:</strong> Experienced kayakers positioned at challenging rapids</li>
            <li><strong>Emergency Communication:</strong> Satellite phones and emergency protocols</li>
          </ul>
          
          <h3>Safety Equipment Provided</h3>
          <ul>
            <li><strong>Life Jackets (PFDs):</strong> High-quality, properly fitted personal flotation devices</li>
            <li><strong>Helmets:</strong> Required for Grade 4+ rapids</li>
            <li><strong>Rafts:</strong> Commercial-grade, self-bailing rafts designed for big water</li>
            <li><strong>Throw Bags:</strong> Emergency rescue equipment</li>
            <li><strong>First Aid Kits:</strong> Comprehensive medical supplies</li>
          </ul>
          
          <h3>Personal Safety Responsibilities</h3>
          <ul>
            <li>Honest assessment of swimming ability and physical fitness</li>
            <li>Full attention during safety briefings</li>
            <li>Following guide instructions immediately and completely</li>
            <li>Wearing provided safety equipment properly</li>
            <li>Informing guides of any medical conditions or concerns</li>
          </ul>
          
          <h3>Risk Factors and Mitigation</h3>
          <div class="risk-table">
            <table>
              <thead>
                <tr>
                  <th>Risk Factor</th>
                  <th>Likelihood</th>
                  <th>Mitigation Strategies</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Falling out of raft</td>
                  <td>Common</td>
                  <td>Proper positioning, following commands, life jacket</td>
                </tr>
                <tr>
                  <td>Minor injuries (bruises, scrapes)</td>
                  <td>Occasional</td>
                  <td>Protective positioning, helmet use, first aid training</td>
                </tr>
                <tr>
                  <td>Equipment failure</td>
                  <td>Rare</td>
                  <td>Regular inspection, backup equipment, professional maintenance</td>
                </tr>
                <tr>
                  <td>Serious injury</td>
                  <td>Very rare</td>
                  <td>Professional guides, safety kayakers, emergency protocols</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="safety-warning">
            <h4>⚠️ When NOT to Raft</h4>
            <ul>
              <li>Pregnancy</li>
              <li>Recent surgery or serious injury</li>
              <li>Heart conditions or serious medical issues</li>
              <li>Unable to swim or extreme fear of water</li>
              <li>Under influence of alcohol or drugs</li>
              <li>Age restrictions (typically minimum 14 years)</li>
            </ul>
          </div>
        `
      },
      {
        id: 'best-time',
        title: 'Best Time for Rafting',
        content: `
          <p>While rafting is possible year-round on the Nile, different seasons offer distinct experiences and challenges.</p>
          
          <h3>Seasonal Overview</h3>
          
          <div class="season-grid">
            <div class="season-card dry-season">
              <h4>Dry Seasons (Best for Beginners)</h4>
              <p><strong>December - February & June - September</strong></p>
              <ul>
                <li>Lower water levels make rapids more technical but less powerful</li>
                <li>Excellent weather with minimal rain</li>
                <li>Best visibility for photography</li>
                <li>Peak tourist season - book in advance</li>
                <li>Higher prices for accommodation</li>
              </ul>
            </div>
            
            <div class="season-card wet-season">
              <h4>Wet Seasons (Best for Experienced Rafters)</h4>
              <p><strong>March - May & October - November</strong></p>
              <ul>
                <li>Higher water levels create more powerful, forgiving rapids</li>
                <li>Lush green scenery and dramatic skies</li>
                <li>Fewer tourists, more intimate experiences</li>
                <li>Lower accommodation prices</li>
                <li>Potential for afternoon thunderstorms</li>
              </ul>
            </div>
          </div>
          
          <h3>Monthly Breakdown</h3>
          <table class="monthly-conditions">
            <thead>
              <tr>
                <th>Month</th>
                <th>Water Level</th>
                <th>Weather</th>
                <th>Crowds</th>
                <th>Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>January</td>
                <td>Low</td>
                <td>Dry & Hot</td>
                <td>High</td>
                <td>Technical rafting, beginners</td>
              </tr>
              <tr>
                <td>February</td>
                <td>Low</td>
                <td>Dry & Hot</td>
                <td>High</td>
                <td>Photography, beginners</td>
              </tr>
              <tr>
                <td>March</td>
                <td>Rising</td>
                <td>Wet Season Starts</td>
                <td>Medium</td>
                <td>Experienced rafters</td>
              </tr>
              <tr>
                <td>April</td>
                <td>High</td>
                <td>Heavy Rains</td>
                <td>Low</td>
                <td>Big water experience</td>
              </tr>
              <tr>
                <td>May</td>
                <td>High</td>
                <td>Heavy Rains</td>
                <td>Low</td>
                <td>Adventure seekers</td>
              </tr>
              <tr>
                <td>June</td>
                <td>Medium</td>
                <td>Dry Season</td>
                <td>Medium</td>
                <td>All skill levels</td>
              </tr>
              <tr>
                <td>July</td>
                <td>Low</td>
                <td>Cool & Dry</td>
                <td>High</td>
                <td>Perfect conditions</td>
              </tr>
              <tr>
                <td>August</td>
                <td>Low</td>
                <td>Cool & Dry</td>
                <td>Peak</td>
                <td>Ideal for all levels</td>
              </tr>
              <tr>
                <td>September</td>
                <td>Low</td>
                <td>Warm & Dry</td>
                <td>High</td>
                <td>Technical challenges</td>
              </tr>
              <tr>
                <td>October</td>
                <td>Rising</td>
                <td>Short Rains</td>
                <td>Medium</td>
                <td>Transitional conditions</td>
              </tr>
              <tr>
                <td>November</td>
                <td>High</td>
                <td>Short Rains</td>
                <td>Low</td>
                <td>Powerful rapids</td>
              </tr>
              <tr>
                <td>December</td>
                <td>Dropping</td>
                <td>Dry Season Returns</td>
                <td>Rising</td>
                <td>Holiday adventures</td>
              </tr>
            </tbody>
          </table>
          
          <h3>Special Considerations</h3>
          <ul>
            <li><strong>Water Releases:</strong> Dam operations can affect river levels - check current conditions</li>
            <li><strong>Weather Patterns:</strong> Climate change has made patterns less predictable</li>
            <li><strong>Local Events:</strong> Some periods may be busier due to local holidays or festivals</li>
            <li><strong>Personal Preference:</strong> Some prefer the challenge of high water, others enjoy technical low water</li>
          </ul>
        `
      },
      {
        id: 'choosing-operator',
        title: 'Choosing Your Rafting Operator',
        content: `
          <p>Selecting the right rafting operator is crucial for safety, enjoyment, and value. Jinja has several reputable companies, each with unique strengths and specialties.</p>
          
          <h3>Key Factors to Consider</h3>
          
          <h4>Safety Record and Certification</h4>
          <ul>
            <li>International Rafting Federation (IRF) certification</li>
            <li>Guide training and certification programs</li>
            <li>Safety equipment quality and maintenance</li>
            <li>Insurance coverage and emergency protocols</li>
            <li>Years of operation without serious incidents</li>
          </ul>
          
          <h4>Experience and Expertise</h4>
          <ul>
            <li>Years of operation on the Nile</li>
            <li>Guide experience levels and local knowledge</li>
            <li>Range of trip options (half-day, full-day, multi-day)</li>
            <li>Specialization in different skill levels</li>
            <li>Knowledge of river conditions and seasonal changes</li>
          </ul>
          
          <h4>Equipment and Facilities</h4>
          <ul>
            <li>Quality and age of rafts and safety equipment</li>
            <li>Changing facilities and amenities</li>
            <li>Transportation quality and safety</li>
            <li>Lunch and refreshment quality</li>
            <li>Photography and video services</li>
          </ul>
          
          <h3>Reputable Operators in Jinja</h3>
          
          <div class="operator-comparison">
            <div class="operator-card">
              <h4>Adrift East Africa</h4>
              <p><strong>Established:</strong> 1996 | <strong>Specialty:</strong> Full-day adventures</p>
              <ul>
                <li>Pioneer of Nile rafting in Uganda</li>
                <li>Comprehensive safety record</li>
                <li>On-river lunch included</li>
                <li>Professional photography service</li>
              </ul>
            </div>
            
            <div class="operator-card">
              <h4>Nalubale Rafting</h4>
              <p><strong>Established:</strong> 1998 | <strong>Specialty:</strong> Technical rapids</p>
              <ul>
                <li>Excellent guide training program</li>
                <li>Focus on environmental sustainability</li>
                <li>Small group experiences</li>
                <li>Local community involvement</li>
              </ul>
            </div>
            
            <div class="operator-card">
              <h4>Nile River Explorers</h4>
              <p><strong>Established:</strong> 1996 | <strong>Specialty:</strong> Multi-day adventures</p>
              <ul>
                <li>Extensive trip variety</li>
                <li>Island camping options</li>
                <li>Combination adventure packages</li>
                <li>Cultural integration programs</li>
              </ul>
            </div>
          </div>
          
          <h3>Questions to Ask Operators</h3>
          <ol>
            <li>What is your guide-to-client ratio?</li>
            <li>How do you handle different skill levels in the same group?</li>
            <li>What happens if someone can't continue the trip?</li>
            <li>What is included in the trip price?</li>
            <li>How do you handle equipment failure or weather issues?</li>
            <li>What are your age and fitness requirements?</li>
            <li>Do you offer trip insurance or what insurance is recommended?</li>
            <li>How far in advance should trips be booked?</li>
          </ol>
          
          <h3>Red Flags to Watch For</h3>
          <ul>
            <li>Unusually low prices with no clear explanation</li>
            <li>Guides without visible certification or training</li>
            <li>Old or poorly maintained equipment</li>
            <li>Unwillingness to discuss safety procedures</li>
            <li>No clear refund or weather cancellation policy</li>
            <li>Pressure to book immediately without time to research</li>
          </ul>
        `
      },
      {
        id: 'physical-requirements',
        title: 'Physical Requirements',
        content: `
          <p>While you don't need to be an Olympic athlete to enjoy Nile rafting, certain physical capabilities ensure both safety and enjoyment during your adventure.</p>
          
          <h3>Minimum Requirements</h3>
          <ul>
            <li><strong>Swimming Ability:</strong> Comfortable swimming 50+ meters in moving water</li>
            <li><strong>Age Limits:</strong> Typically 14+ years (varies by operator and water levels)</li>
            <li><strong>Weight Restrictions:</strong> Usually 40-120kg (varies by safety equipment sizing)</li>
            <li><strong>Basic Fitness:</strong> Ability to paddle continuously for 30+ minutes</li>
            <li><strong>No Serious Medical Conditions:</strong> Heart problems, pregnancy, recent surgeries</li>
          </ul>
          
          <h3>Recommended Fitness Level</h3>
          
          <div class="fitness-levels">
            <div class="fitness-card beginner">
              <h4>Beginner Level</h4>
              <p><strong>Half-day trips, Grade 2-3 rapids</strong></p>
              <ul>
                <li>Basic swimming skills</li>
                <li>Can walk 2-3 kilometers comfortably</li>
                <li>No major health concerns</li>
                <li>Comfortable in water</li>
              </ul>
            </div>
            
            <div class="fitness-card intermediate">
              <h4>Intermediate Level</h4>
              <p><strong>Full-day trips, Grade 3-4 rapids</strong></p>
              <ul>
                <li>Strong swimming ability</li>
                <li>Regular moderate exercise routine</li>
                <li>Can handle 6-8 hours of activity</li>
                <li>Good core and arm strength</li>
              </ul>
            </div>
            
            <div class="fitness-card advanced">
              <h4>Advanced Level</h4>
              <p><strong>Multi-day trips, Grade 4-5 rapids</strong></p>
              <ul>
                <li>Excellent swimming in rough water</li>
                <li>High cardiovascular fitness</li>
                <li>Experience with water sports</li>
                <li>Can handle extended physical exertion</li>
              </ul>
            </div>
          </div>
          
          <h3>Preparation Recommendations</h3>
          
          <h4>6-8 Weeks Before Your Trip</h4>
          <ul>
            <li><strong>Cardiovascular Training:</strong> Swimming, cycling, running - 30+ minutes, 3x per week</li>
            <li><strong>Strength Training:</strong> Focus on core, shoulders, and back muscles</li>
            <li><strong>Swimming Practice:</strong> Open water swimming if possible</li>
            <li><strong>Flexibility:</strong> Yoga or stretching routines for injury prevention</li>
          </ul>
          
          <h4>2-4 Weeks Before Your Trip</h4>
          <ul>
            <li>Increase training intensity and duration</li>
            <li>Practice treading water for extended periods</li>
            <li>Work on breath control and underwater confidence</li>
            <li>Address any minor injuries or physical issues</li>
          </ul>
          
          <h3>Day-of-Trip Physical Considerations</h3>
          <ul>
            <li><strong>Hydration:</strong> Start hydrating 24 hours before, avoid alcohol</li>
            <li><strong>Nutrition:</strong> Light, energizing breakfast - avoid heavy meals</li>
            <li><strong>Rest:</strong> Good night's sleep before your adventure</li>
            <li><strong>Medication:</strong> Take any necessary medications as prescribed</li>
            <li><strong>Sun Protection:</strong> Sunscreen, hat, and protective clothing</li>
          </ul>
          
          <div class="medical-considerations">
            <h4>🏥 Medical Considerations</h4>
            <p><strong>Consult your doctor if you have:</strong></p>
            <ul>
              <li>Heart conditions or high blood pressure</li>
              <li>Respiratory issues (asthma, etc.)</li>
              <li>Recent surgeries or injuries</li>
              <li>Pregnancy or trying to conceive</li>
              <li>Seizure disorders</li>
              <li>Diabetes or blood sugar management issues</li>
              <li>Any medications that affect balance or coordination</li>
            </ul>
          </div>
          
          <h3>Alternative Options</h3>
          <p>If you don't meet the physical requirements for full rafting, consider:</p>
          <ul>
            <li><strong>Gentler River Sections:</strong> Grade 1-2 scenic floats</li>
            <li><strong>Riverbank Activities:</strong> Photography, bird watching, cultural visits</li>
            <li><strong>Lake Victoria:</strong> Calmer water activities and boat tours</li>
            <li><strong>Supporting Role:</strong> Join the group for pre/post activities while others raft</li>
          </ul>
        `
      },
      {
        id: 'what-to-bring',
        title: 'What to Bring',
        content: `
          <p>Proper preparation and packing enhance your safety, comfort, and enjoyment during your Nile rafting adventure.</p>
          
          <h3>Essential Items (Must Bring)</h3>
          
          <div class="packing-categories">
            <div class="packing-category">
              <h4>🏊‍♂️ Swimming/Water Gear</h4>
              <ul>
                <li><strong>Swimming costume:</strong> Well-fitting, secure design</li>
                <li><strong>Quick-dry shorts/top:</strong> Over swimwear for sun protection</li>
                <li><strong>Water shoes:</strong> Secure fit, good grip (not flip-flops)</li>
                <li><strong>Towel:</strong> Quick-dry microfiber recommended</li>
              </ul>
            </div>
            
            <div class="packing-category">
              <h4>☀️ Sun Protection</h4>
              <ul>
                <li><strong>Sunscreen:</strong> Waterproof SPF 30+, reef-safe formula</li>
                <li><strong>Hat with chin strap:</strong> Won't blow off in rapids</li>
                <li><strong>Sunglasses with strap:</strong> Polarized, secure attachment</li>
                <li><strong>Long-sleeve rash guard:</strong> UV protection for extended exposure</li>
              </ul>
            </div>
            
            <div class="packing-category">
              <h4>🏥 Health & Safety</h4>
              <ul>
                <li><strong>Personal medications:</strong> In waterproof containers</li>
                <li><strong>Contact lens backup:</strong> If you wear contacts</li>
                <li><strong>Insect repellent:</strong> For pre/post rafting activities</li>
                <li><strong>Hand sanitizer:</strong> Travel-size bottle</li>
              </ul>
            </div>
            
            <div class="packing-category">
              <h4>📱 Personal Items</h4>
              <ul>
                <li><strong>Waterproof phone case:</strong> Fully submersible rated</li>
                <li><strong>Extra clothes:</strong> Complete dry change for after</li>
                <li><strong>Plastic bags:</strong> For wet items and extra protection</li>
                <li><strong>Small amount of cash:</strong> Tips, purchases</li>
              </ul>
            </div>
          </div>
          
          <h3>Recommended but Optional</h3>
          <ul>
            <li><strong>Action camera:</strong> GoPro or similar with secure mounting</li>
            <li><strong>Waterproof watch:</strong> Track time and heart rate</li>
            <li><strong>Energy snacks:</strong> Waterproof packages</li>
            <li><strong>Lip balm with SPF:</strong> Prevent chapped lips</li>
            <li><strong>Bandana or buff:</strong> Versatile protection and utility</li>
            <li><strong>Waterproof bag:</strong> Extra protection for valuables</li>
          </ul>
          
          <h3>What NOT to Bring</h3>
          <ul>
            <li><strong>Cotton clothing:</strong> Takes forever to dry, loses insulation when wet</li>
            <li><strong>Flip-flops or loose sandals:</strong> Will come off in rapids</li>
            <li><strong>Valuable jewelry:</strong> Risk of loss in water</li>
            <li><strong>Large amounts of cash:</strong> Minimize what you bring</li>
            <li><strong>Non-waterproof electronics:</strong> Unless in waterproof cases</li>
            <li><strong>Glass containers:</strong> Safety hazard if broken</li>
            <li><strong>Loose hats without straps:</strong> Will blow away</li>
            <li><strong>Heavy jeans or denim:</strong> Uncomfortable when wet</li>
          </ul>
          
          <h3>Photography Equipment</h3>
          <p>Capturing memories is important, but safety comes first:</p>
          
          <div class="photo-options">
            <div class="photo-option">
              <h4>Professional Service (Recommended)</h4>
              <ul>
                <li>Most operators offer professional photo/video packages</li>
                <li>Experienced photographers know the best angles</li>
                <li>No risk to your equipment</li>
                <li>You focus on the experience, not the camera</li>
                <li>Cost: Usually $30-60 for full photo package</li>
              </ul>
            </div>
            
            <div class="photo-option">
              <h4>Personal Equipment</h4>
              <ul>
                <li><strong>Waterproof case:</strong> Fully submersible rating essential</li>
                <li><strong>Secure attachment:</strong> Multiple tethering points</li>
                <li><strong>Simple operation:</strong> Easy to use with wet hands/gloves</li>
                <li><strong>Backup storage:</strong> Multiple memory cards</li>
                <li><strong>Practice beforehand:</strong> Know your equipment well</li>
              </ul>
            </div>
          </div>
          
          <h3>Final Packing Tips</h3>
          <ul>
            <li><strong>Pack light:</strong> You'll be carrying everything in/out of rafts</li>
            <li><strong>Double-bag important items:</strong> Two layers of waterproof protection</li>
            <li><strong>Label everything:</strong> Name and contact info on gear</li>
            <li><strong>Test waterproof items:</strong> Before relying on them</li>
            <li><strong>Bring a day pack:</strong> For carrying items during non-rafting portions</li>
            <li><strong>Leave valuables at accommodation:</strong> Hotel safe or locked room</li>
          </ul>
        `
      },
      {
        id: 'rafting-day',
        title: 'Your Rafting Day Experience',
        content: `
          <p>Understanding the typical flow of a rafting day helps set expectations and allows you to fully enjoy every moment of your Nile adventure.</p>
          
          <div class="day-timeline">
            <div class="timeline-item morning">
              <div class="timeline-time">6:30 AM</div>
              <div class="timeline-content">
                <h4>Early Morning Pickup</h4>
                <p>Most operators provide hotel pickup in Jinja or Kampala. Light breakfast recommended before departure.</p>
                <ul>
                  <li>Confirm pickup location and time</li>
                  <li>Final gear check</li>
                  <li>Light, energizing breakfast</li>
                  <li>Hydrate well but not excessively</li>
                </ul>
              </div>
            </div>
            
            <div class="timeline-item morning">
              <div class="timeline-time">8:00 AM</div>
              <div class="timeline-content">
                <h4>Base Camp Arrival & Registration</h4>
                <p>Arrival at operator's base camp for check-in, waivers, and initial preparations.</p>
                <ul>
                  <li>Complete safety waivers</li>
                  <li>Secure storage for valuables</li>
                  <li>Change into rafting gear</li>
                  <li>Meet your guide team</li>
                  <li>Equipment fitting</li>
                </ul>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'safety-briefing',
        title: 'Safety Briefing Details',
        content: `
          <h3>Comprehensive Safety Education</h3>
          <p>The safety briefing is mandatory and covers essential information for your protection and enjoyment. Pay close attention - this information could save your life.</p>
          
          <div class="briefing-sections">
            <div class="briefing-section">
              <h4>Equipment Overview</h4>
              <ul>
                <li><strong>Life Jacket (PFD):</strong> Proper fit, adjustment, and limitations</li>
                <li><strong>Helmet:</strong> When required, proper fit and care</li>
                <li><strong>Paddle:</strong> Holding technique, different stroke types</li>
                <li><strong>Raft Features:</strong> Safety lines, foot cups, throw bags</li>
              </ul>
            </div>
            
            <div class="briefing-section">
              <h4>Paddling Commands</h4>
              <ul>
                <li><strong>"Forward paddle":</strong> Everyone paddle forward strongly</li>
                <li><strong>"Back paddle":</strong> Reverse direction to slow or turn</li>
                <li><strong>"Right/Left turn":</strong> Specific sides paddle differently</li>
                <li><strong>"High side":</strong> Move to high side of raft to prevent flipping</li>
                <li><strong>"Get down":</strong> Lower center of gravity for big water</li>
                <li><strong>"STOP":</strong> Immediate cessation of all paddling</li>
              </ul>
            </div>
            
            <div class="briefing-section">
              <h4>Swimming Position</h4>
              <p>If you fall out (which is common and part of the fun):</p>
              <ul>
                <li><strong>Feet first, on your back:</strong> Protect yourself from rocks</li>
                <li><strong>Point feet downstream:</strong> Use legs as shock absorbers</li>
                <li><strong>Keep head up:</strong> Watch for obstacles and rescue</li>
                <li><strong>Don't try to stand:</strong> Risk of foot entrapment</li>
                <li><strong>Swim aggressively to shore or raft:</strong> When safe to do so</li>
              </ul>
            </div>
            
            <div class="briefing-section">
              <h4>Rescue Procedures</h4>
              <ul>
                <li><strong>Self-rescue:</strong> Swimming to safety zones</li>
                <li><strong>Raft rescue:</strong> How to help someone back into raft</li>
                <li><strong>Throw bag rescue:</strong> Proper technique for rope assistance</li>
                <li><strong>Emergency signals:</strong> Whistle codes and hand signals</li>
              </ul>
            </div>
          </div>
          
          <h3>Practice Session</h3>
          <p>Most operators include practice in calm water before hitting the rapids:</p>
          <ul>
            <li>Paddle stroke practice</li>
            <li>Command response drills</li>
            <li>Intentional swimming practice</li>
            <li>Raft re-entry techniques</li>
            <li>Team coordination exercises</li>
          </ul>
          
          <div class="safety-reminder">
            <h4>🚨 Remember: Safety First</h4>
            <p>Your guide's instructions override everything else. If they say stop, jump, or move - do it immediately without question. Their experience and training are designed to keep you safe.</p>
          </div>
        `
      },
      {
        id: 'river-sections',
        title: 'River Sections and Rapids',
        content: `
          <p>The Nile below Jinja offers distinct sections, each with unique characteristics and challenges. Understanding the river layout helps you anticipate and enjoy each part of your journey.</p>
          
          <h3>Upper Section: Launch to Big Brother</h3>
          <p><strong>Distance:</strong> ~5km | <strong>Duration:</strong> 1-2 hours | <strong>Character:</strong> Warm-up and skill building</p>
          
          <div class="river-section">
            <h4>Key Rapids:</h4>
            <ul>
              <li><strong>Itanda Falls (Scenic Stop):</strong> Powerful waterfall viewpoint</li>
              <li><strong>Hairy Lemon (Grade 3):</strong> Fun introduction to bigger water</li>
              <li><strong>Bubugo Warm-up (Grade 2-3):</strong> Practice for the big one ahead</li>
            </ul>
            
            <p><strong>What to Expect:</strong> This section allows you to get comfortable with your raft crew, practice commands, and build confidence. The scenery is spectacular with bird life and local fishing communities visible along the banks.</p>
          </div>
          
          <h3>Middle Section: The Heart of the Action</h3>
          <p><strong>Distance:</strong> ~8km | <strong>Duration:</strong> 3-4 hours | <strong>Character:</strong> Main event rapids</p>
          
          <div class="river-section">
            <h4>Major Rapids:</h4>
            
            <div class="rapid-detail">
              <h5>Big Brother (Grade 4)</h5>
              <p>The first major test - a powerful, technical rapid requiring precise navigation. Multiple routes possible depending on water level.</p>
              <ul>
                <li><strong>Character:</strong> Large waves, strong hydraulics</li>
                <li><strong>Difficulty:</strong> Technical entry, forgiving exit</li>
                <li><strong>Swimming Risk:</strong> Medium - rescue positions available</li>
              </ul>
            </div>
            
            <div class="rapid-detail">
              <h5>Bubugo (Grade 5)</h5>
              <p>The most challenging commercial rapid on the Nile - a true test of teamwork and guide skill.</p>
              <ul>
                <li><strong>Character:</strong> Massive hydraulics, multiple drops</li>
                <li><strong>Difficulty:</strong> Expert level navigation required</li>
                <li><strong>Swimming Risk:</strong> High - strong safety presence essential</li>
                <li><strong>Portage Option:</strong> Available for those who prefer</li>
              </ul>
            </div>
            
            <div class="rapid-detail">
              <h5>Silverback (Grade 4)</h5>
              <p>Long, sustained rapid with multiple features - endurance and teamwork essential.</p>
              <ul>
                <li><strong>Character:</strong> Extended action, wave trains</li>
                <li><strong>Difficulty:</strong> Sustained effort required</li>
                <li><strong>Swimming Risk:</strong> Medium - long swim possible</li>
              </ul>
            </div>
            
            <div class="rapid-detail">
              <h5>Nile Special (Grade 5)</h5>
              <p>Technical rapid with complex hydraulics - requires experienced guides and crews.</p>
              <ul>
                <li><strong>Character:</strong> Technical complexity, precision required</li>
                <li><strong>Difficulty:</strong> Expert navigation essential</li>
                <li><strong>Swimming Risk:</strong> High in certain areas</li>
              </ul>
            </div>
            
            <div class="rapid-detail">
              <h5>G-Spot (Grade 4)</h5>
              <p>Fun, forgiving rapid that often provides the most enjoyment - big waves, clear routes.</p>
              <ul>
                <li><strong>Character:</strong> Big waves, straightforward navigation</li>
                <li><strong>Difficulty:</strong> Challenging but forgiving</li>
                <li><strong>Swimming Risk:</strong> Low - fun swimming rapid</li>
              </ul>
            </div>
          </div>
          
          <h3>Lower Section: Recovery and Reflection</h3>
          <p><strong>Distance:</strong> ~3km | <strong>Duration:</strong> 1 hour | <strong>Character:</strong> Calm water and smaller rapids</p>
          
          <div class="river-section">
            <h4>Features:</h4>
            <ul>
              <li>Calm pools for swimming and relaxation</li>
              <li>Scenic floating through rural landscapes</li>
              <li>Smaller Grade 2-3 rapids for fun</li>
              <li>Wildlife viewing opportunities</li>
              <li>Photography and celebration time</li>
            </ul>
            
            <p><strong>What to Expect:</strong> This section provides time to process the adventure, enjoy the natural beauty, and celebrate your achievements. Many groups use this time for reflection and group photos.</p>
          </div>
          
          <h3>Seasonal Variations</h3>
          <p>Rapids change character significantly with water levels:</p>
          
          <div class="seasonal-changes">
            <div class="season-change">
              <h4>High Water (March-May, Oct-Nov)</h4>
              <ul>
                <li>Rapids become more powerful but often more forgiving</li>
                <li>Some technical features get washed out</li>
                <li>Bigger waves and stronger currents</li>
                <li>Shorter swimming distances to safety</li>
              </ul>
            </div>
            
            <div class="season-change">
              <h4>Low Water (Dec-Feb, Jun-Sep)</h4>
              <ul>
                <li>Rapids become more technical and precise</li>
                <li>Rock obstacles more prominent</li>
                <li>Longer, more complex rapid sequences</li>
                <li>More challenging rescue situations</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        id: 'emergency-procedures',
        title: 'Emergency Procedures',
        content: `
          <p>While serious emergencies are rare on professionally guided trips, understanding emergency procedures builds confidence and ensures quick, appropriate responses if needed.</p>
          
          <h3>Types of Emergencies</h3>
          
          <div class="emergency-types">
            <div class="emergency-type minor">
              <h4>Minor Incidents (Common)</h4>
              <ul>
                <li><strong>Falling out of raft:</strong> Standard procedure, often enjoyable</li>
                <li><strong>Minor cuts/bruises:</strong> Basic first aid available</li>
                <li><strong>Lost paddle:</strong> Spare equipment carried</li>
                <li><strong>Temporary separation from group:</strong> Established meeting points</li>
              </ul>
              <p><strong>Response:</strong> Follow guide instructions, use established procedures</p>
            </div>
            
            <div class="emergency-type moderate">
              <h4>Moderate Incidents (Uncommon)</h4>
              <ul>
                <li><strong>Raft flip:</strong> All crew in water, raft recovery needed</li>
                <li><strong>Equipment failure:</strong> Raft damage requiring repair/replacement</li>
                <li><strong>Swimmer separated:</strong> Person swimming away from group</li>
                <li><strong>Minor injury:</strong> Requiring first aid and possible evacuation</li>
              </ul>
              <p><strong>Response:</strong> Immediate guide assessment, group management, safety protocols</p>
            </div>
            
            <div class="emergency-type serious">
              <h4>Serious Incidents (Rare)</h4>
              <ul>
                <li><strong>Serious injury:</strong> Requiring immediate medical attention</li>
                <li><strong>Person missing:</strong> Unaccounted for after reasonable time</li>
                <li><strong>Severe weather:</strong> Lightning, flash flood conditions</li>
                <li><strong>Multiple equipment failures:</strong> Compromising group safety</li>
              </ul>
              <p><strong>Response:</strong> Emergency action plan, evacuation procedures, professional rescue</p>
            </div>
          </div>
          
          <h3>Communication Systems</h3>
          
          <div class="communication-systems">
            <h4>On-River Communication</h4>
            <ul>
              <li><strong>Whistle Codes:</strong> 
                <ul>
                  <li>One blast: Attention/Warning</li>
                  <li>Three blasts: Emergency/Help needed</li>
                  <li>Multiple short blasts: All clear/Resume</li>
                </ul>
              </li>
              <li><strong>Hand Signals:</strong>
                <ul>
                  <li>Thumbs up: All okay</li>
                  <li>Raised fist: Stop immediately</li>
                  <li>Pointing: Direction or danger indication</li>
                  <li>Arms crossed overhead: Emergency</li>
                </ul>
              </li>
            </ul>
            
            <h4>Emergency Communication</h4>
            <ul>
              <li><strong>Satellite Phones:</strong> Carried by lead guides</li>
              <li><strong>Two-way Radios:</strong> Communication between raft teams</li>
              <li><strong>Emergency Beacons:</strong> GPS location transmitters</li>
              <li><strong>Cell Phone Coverage:</strong> Limited but improving in some areas</li>
            </ul>
          </div>
          
          <h3>Evacuation Procedures</h3>
          
          <div class="evacuation-methods">
            <h4>River Evacuation</h4>
            <ul>
              <li><strong>Raft Transport:</strong> Injured person transported in raft to road access</li>
              <li><strong>Kayak Escort:</strong> Fast evacuation using safety kayaks</li>
              <li><strong>Bank Walking:</strong> Evacuation along riverbank to access points</li>
              <li><strong>Swimming Assist:</strong> Supported swimming to safe areas</li>
            </ul>
            
            <h4>Medical Evacuation</h4>
            <ul>
              <li><strong>Road Transport:</strong> Vehicle evacuation to medical facilities</li>
              <li><strong>Helicopter Evacuation:</strong> For serious emergencies (weather dependent)</li>
              <li><strong>Boat Transport:</strong> Lake Victoria access for some areas</li>
              <li><strong>Walking Evacuation:</strong> Supported walking to access points</li>
            </ul>
          </div>
          
          <h3>Medical Facilities and Contacts</h3>
          
          <div class="medical-contacts">
            <h4>Primary Medical Facilities</h4>
            <ul>
              <li><strong>Jinja Regional Referral Hospital:</strong> Main government hospital, basic trauma care</li>
              <li><strong>Nile International Hospital:</strong> Private facility with better equipment</li>
              <li><strong>Healthcare Clinics:</strong> Several private clinics for minor issues</li>
            </ul>
            
            <h4>Emergency Contacts</h4>
            <ul>
              <li><strong>Uganda Emergency Services:</strong> 999 or 911</li>
              <li><strong>Police:</strong> 999</li>
              <li><strong>Fire/Ambulance:</strong> 999</li>
              <li><strong>Tourist Police:</strong> +256 414 344 906</li>
              <li><strong>Your Embassy:</strong> Keep contact information available</li>
            </ul>
            
            <h4>Insurance and Evacuation</h4>
            <ul>
              <li><strong>Travel Insurance:</strong> Ensure adventure sports coverage</li>
              <li><strong>Evacuation Insurance:</strong> Consider specific evacuation coverage</li>
              <li><strong>Embassy Registration:</strong> Register with your embassy if recommended</li>
              <li><strong>Emergency Contacts:</strong> Provide to operator and keep copies</li>
            </ul>
          </div>
          
          <h3>Prevention is Best Protection</h3>
          
          <div class="prevention-tips">
            <h4>Personal Responsibility</h4>
            <ul>
              <li>Honest assessment of fitness and swimming ability</li>
              <li>Follow all guide instructions immediately and completely</li>
              <li>Wear all provided safety equipment properly</li>
              <li>Communicate concerns or limitations to guides</li>
              <li>Stay hydrated and manage energy levels</li>
            </ul>
            
            <h4>Risk Management</h4>
            <ul>
              <li>Choose reputable operators with strong safety records</li>
              <li>Understand trip difficulty and requirements honestly</li>
              <li>Check weather conditions and seasonal considerations</li>
              <li>Ensure adequate insurance coverage</li>
              <li>Inform others of your trip plans and timing</li>
            </ul>
          </div>
        `
      },
      {
        id: 'photography-options',
        title: 'Photography and Video Options',
        content: `
          <p>Capturing memories of your Nile rafting adventure requires planning, but the spectacular scenery and action make it worthwhile. You have several options, each with different advantages and considerations.</p>
          
          <h3>Professional Photography Services</h3>
          <p><strong>Recommended for most visitors</strong></p>
          
          <div class="photo-services">
            <h4>Advantages</h4>
            <ul>
              <li><strong>Expert photographers:</strong> Know the best angles and timing</li>
              <li><strong>Professional equipment:</strong> High-quality cameras and waterproof housings</li>
              <li><strong>Strategic positioning:</strong> Photographers positioned at key rapids</li>
              <li><strong>No risk to your equipment:</strong> Focus on the experience, not the camera</li>
              <li><strong>Multiple formats:</strong> Photos, videos, and action shots</li>
              <li><strong>Quick turnaround:</strong> Usually available same day or within 24 hours</li>
            </ul>
            
            <h4>What's Typically Included</h4>
            <ul>
              <li>50-100+ high-resolution photos</li>
              <li>Action video footage (5-15 minutes)</li>
              <li>Group photos before and after</li>
              <li>Individual and team action shots</li>
              <li>Scenic river and landscape photos</li>
              <li>Digital download or USB delivery</li>
            </ul>
            
            <h4>Cost and Booking</h4>
            <ul>
              <li><strong>Price Range:</strong> $30-80 USD depending on package</li>
              <li><strong>Booking:</strong> Can usually be added on the day</li>
              <li><strong>Payment:</strong> Cash or mobile money typically</li>
              <li><strong>Group Discounts:</strong> Often available for larger groups</li>
            </ul>
          </div>
          
          <h3>Personal Equipment Options</h3>
          <p><strong>For photography enthusiasts willing to accept risks</strong></p>
          
          <div class="personal-equipment">
            <h4>Action Cameras (GoPro, etc.)</h4>
            <ul>
              <li><strong>Advantages:</strong> Compact, waterproof, wide angle capture</li>
              <li><strong>Mounting options:</strong> Helmet, chest harness, paddle, raft</li>
              <li><strong>Settings:</strong> Use highest resolution, stabilization on</li>
              <li><strong>Limitations:</strong> Battery life, memory capacity, loss risk</li>
            </ul>
            
            <h4>Waterproof Phone Cases</h4>
            <ul>
              <li><strong>Pros:</strong> Familiar interface, immediate sharing capability</li>
              <li><strong>Cons:</strong> Touchscreen issues when wet, size limitations</li>
              <li><strong>Requirements:</strong> Fully submersible rating (IPX8 minimum)</li>
              <li><strong>Testing:</strong> Test thoroughly before relying on it</li>
            </ul>
            
            <h4>Waterproof Cameras</h4>
            <ul>
              <li><strong>Options:</strong> Olympus TG series, Nikon Coolpix AW series</li>
              <li><strong>Advantages:</strong> True waterproofing, better image quality</li>
              <li><strong>Considerations:</strong> Size, weight, learning curve</li>
              <li><strong>Accessories:</strong> Floating straps, protective cases</li>
            </ul>
          </div>
          
          <h3>Photography Techniques and Tips</h3>
          
          <div class="photo-techniques">
            <h4>Camera Settings for Rafting</h4>
            <ul>
              <li><strong>Shutter Priority:</strong> 1/500s or faster for action</li>
              <li><strong>Continuous Autofocus:</strong> For moving subjects</li>
              <li><strong>Burst Mode:</strong> Capture sequences of action</li>
              <li><strong>Higher ISO:</strong> Compensate for fast shutter speeds</li>
              <li><strong>Stabilization:</strong> Enable all available stabilization</li>
            </ul>
            
            <h4>Composition Strategies</h4>
            <ul>
              <li><strong>Wide shots:</strong> Show scale of rapids and scenery</li>
              <li><strong>Action shots:</strong> Capture peak moments of excitement</li>
              <li><strong>Expressions:</strong> Focus on faces showing emotion</li>
              <li><strong>Environmental context:</strong> Include beautiful river settings</li>
              <li><strong>Before/after:</strong> Document the complete experience</li>
            </ul>
            
            <h4>Safety Considerations</h4>
            <ul>
              <li><strong>Secure attachment:</strong> Multiple tethering points always</li>
              <li><strong>Quick release:</strong> Must be able to jettison equipment instantly</li>
              <li><strong>No interference:</strong> Cannot impede paddling or safety</li>
              <li><strong>Guide approval:</strong> Always check with guides first</li>
              <li><strong>Backup plan:</strong> Know what to do if equipment fails</li>
            </ul>
          </div>
          
          <h3>Smartphone Photography</h3>
          
          <div class="smartphone-tips">
            <h4>Maximizing Phone Cameras</h4>
            <ul>
              <li><strong>Waterproof case selection:</strong>
                <ul>
                  <li>Test thoroughly before trip</li>
                  <li>Ensure touch sensitivity</li>
                  <li>Check camera lens clarity</li>
                  <li>Verify secure sealing</li>
                </ul>
              </li>
              <li><strong>Camera app optimization:</strong>
                <ul>
                  <li>Use native camera app (usually most optimized)</li>
                  <li>Enable burst mode and live photos</li>
                  <li>Practice one-handed operation</li>
                  <li>Clean lens frequently</li>
                </ul>
              </li>
              <li><strong>Storage and backup:</strong>
                <ul>
                  <li>Clear storage space before trip</li>
                  <li>Enable cloud backup if connectivity available</li>
                  <li>Consider bringing portable charger</li>
                </ul>
              </li>
            </ul>
          </div>
          
          <h3>Social Media and Sharing</h3>
          
          <div class="social-sharing">
            <h4>Immediate Sharing</h4>
            <ul>
              <li><strong>Connectivity:</strong> Limited on river, available at base camps</li>
              <li><strong>Data costs:</strong> International roaming can be expensive</li>
              <li><strong>Local SIM cards:</strong> Consider purchasing for better rates</li>
              <li><strong>WiFi availability:</strong> Most accommodations and restaurants offer WiFi</li>
            </ul>
            
            <h4>Hashtags and Tagging</h4>
            <ul>
              <li>#NileRafting #JinjaAdventures #SourceOfTheNile</li>
              <li>#UgandaAdventures #WhiteWaterRafting #EastAfrica</li>
              <li>Tag your rafting operator and accommodation</li>
              <li>Tag travel companions and guides (with permission)</li>
            </ul>
            
            <h4>Responsible Sharing</h4>
            <ul>
              <li>Respect privacy of other participants</li>
              <li>Avoid sharing exact locations immediately (security)</li>
              <li>Credit photographers and guides appropriately</li>
              <li>Share positive experiences to support local tourism</li>
            </ul>
          </div>
          
          <h3>Professional Photography Packages Comparison</h3>
          
          <table class="photo-packages">
            <thead>
              <tr>
                <th>Package</th>
                <th>Price Range</th>
                <th>Photos</th>
                <th>Video</th>
                <th>Extras</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Basic</td>
                <td>$30-40</td>
                <td>30-50</td>
                <td>Short clips</td>
                <td>USB delivery</td>
              </tr>
              <tr>
                <td>Standard</td>
                <td>$40-60</td>
                <td>50-100</td>
                <td>5-10 min video</td>
                <td>Same day delivery</td>
              </tr>
              <tr>
                <td>Premium</td>
                <td>$60-80</td>
                <td>100+ photos</td>
                <td>15+ min video</td>
                <td>Editing, music, titles</td>
              </tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'after-rafting',
        title: 'After Your Rafting Adventure',
        content: `
          <p>Your Nile rafting adventure doesn't end when you step out of the raft. The post-rafting experience is an important part of processing your adventure and transitioning back to dry land activities.</p>
          
          <h3>Immediate Post-Rafting (First Hour)</h3>
          
          <div class="post-rafting-timeline">
            <div class="timeline-item">
              <h4>Celebration and Decompression</h4>
              <ul>
                <li><strong>Victory celebration:</strong> Share stories and high-fives with your team</li>
                <li><strong>Photo opportunities:</strong> Group photos with wet, happy faces</li>
                <li><strong>Initial storytelling:</strong> Immediate reactions and favorite moments</li>
                <li><strong>Equipment return:</strong> Hand back life jackets, helmets, and paddles</li>
              </ul>
            </div>
            
            <div class="timeline-item">
              <h4>Physical Recovery</h4>
              <ul>
                <li><strong>Hydration:</strong> Drink plenty of water to rehydrate</li>
                <li><strong>Light snacking:</strong> Energy bars or fruit to restore energy</li>
                <li><strong>Stretching:</strong> Gentle stretches for paddling muscles</li>
                <li><strong>Assessment:</strong> Check for any minor injuries or concerns</li>
              </ul>
            </div>
            
            <div class="timeline-item">
              <h4>Changing and Cleanup</h4>
              <ul>
                <li><strong>Dry clothes:</strong> Change into comfortable, dry clothing</li>
                <li><strong>Warm shower:</strong> Many operators provide shower facilities</li>
                <li><strong>Sun protection:</strong> Apply after-sun care if needed</li>
                <li><strong>Gear organization:</strong> Sort wet from dry items</li>
              </ul>
            </div>
          </div>
          
          <h3>Lunch and Social Time</h3>
          
          <div class="lunch-experience">
            <h4>Typical Post-Rafting Meals</h4>
            <ul>
              <li><strong>Local cuisine:</strong> Authentic Ugandan dishes like matoke, posho, or rice</li>
              <li><strong>Grilled meats:</strong> Beef, chicken, or fish prepared fresh</li>
              <li><strong>Vegetarian options:</strong> Usually available with advance notice</li>
              <li><strong>Fresh fruits:</strong> Tropical fruits like pineapple, mango, bananas</li>
              <li><strong>Cold beverages:</strong> Soft drinks, local beers, or fresh juices</li>
            </ul>
            
            <h4>Social Aspects</h4>
            <ul>
              <li><strong>Story sharing:</strong> Different perspectives on the same rapids</li>
              <li><strong>Guide interactions:</strong> Learn more about local culture and river knowledge</li>
              <li><strong>Group bonding:</strong> Shared adventure creates strong connections</li>
              <li><strong>Photography review:</strong> Professional photos often available for viewing</li>
              <li><strong>Planning discussions:</strong> Ideas for other activities in Uganda</li>
            </ul>
          </div>
          
          <h3>Physical and Emotional Processing</h3>
          
          <div class="processing-experience">
            <h4>Physical Effects to Expect</h4>
            <ul>
              <li><strong>Muscle fatigue:</strong> Paddling muscles, core, and back may be sore</li>
              <li><strong>Adrenaline crash:</strong> Natural tiredness after excitement</li>
              <li><strong>Sun exposure:</strong> Even with protection, some effects possible</li>
              <li><strong>Dehydration:</strong> Continue hydrating throughout the day</li>
              <li><strong>Minor injuries:</strong> Small cuts, bruises, or bumps are normal</li>
            </ul>
            
            <h4>Emotional Responses</h4>
            <ul>
              <li><strong>Euphoria:</strong> Natural high from accomplishment and adrenaline</li>
              <li><strong>Relief:</strong> Glad to have survived challenging rapids</li>
              <li><strong>Pride:</strong> Sense of achievement and overcoming fears</li>
              <li><strong>Bonding:</strong> Stronger connections with trip companions</li>
              <li><strong>Reflection:</strong> Processing the experience and its meaning</li>
            </ul>
          </div>
          
          <h3>Photography and Memory Preservation</h3>
          
          <div class="memory-preservation">
            <h4>Professional Photo/Video Review</h4>
            <ul>
              <li><strong>Preview time:</strong> Usually available 2-4 hours post-rafting</li>
              <li><strong>Selection process:</strong> Choose favorites from larger collection</li>
              <li><strong>Payment and delivery:</strong> Various options for receiving files</li>
              <li><strong>Social media sharing:</strong> Immediate posting vs. delayed sharing</li>
            </ul>
            
            <h4>Personal Documentation</h4>
            <ul>
              <li><strong>Journal writing:</strong> Capture immediate thoughts and emotions</li>
              <li><strong>Social media posts:</strong> Share experience with friends and family</li>
              <li><strong>Equipment review:</strong> How well did personal gear perform?</li>
              <li><strong>Recommendation notes:</strong> What would you tell future rafters?</li>
            </ul>
          </div>
          
          <h3>Transportation Back</h3>
          
          <div class="return-transport">
            <h4>Typical Return Schedule</h4>
            <ul>
              <li><strong>Departure timing:</strong> Usually 4-6 PM for day trips</li>
              <li><strong>Travel time:</strong> 2-3 hours to Kampala, 30 minutes within Jinja</li>
              <li><strong>Drop-off locations:</strong> Hotels, airport, or specified locations</li>
              <li><strong>Group coordination:</strong> May involve multiple stops</li>
            </ul>
            
            <h4>Vehicle Comfort</h4>
            <ul>
              <li><strong>Air conditioning:</strong> Important after day in sun</li>
              <li><strong>Comfortable seating:</strong> Good for tired, sore muscles</li>
              <li><strong>Storage space:</strong> Room for wet gear and new purchases</li>
              <li><strong>Driver experience:</strong> Familiar with post-adventure passengers</li>
            </ul>
          </div>
          
          <h3>Evening Activities and Recovery</h3>
          
          <div class="evening-recovery">
            <h4>Recommended Evening Activities</h4>
            <ul>
              <li><strong>Light dinner:</strong> Avoid heavy meals as appetite may be affected</li>
              <li><strong>Gentle stretching:</strong> Yoga or light stretches for sore muscles</li>
              <li><strong>Early rest:</strong> Physical and emotional exertion requires recovery</li>
              <li><strong>Hydration continuation:</strong> Keep drinking water throughout evening</li>
              <li><strong>Celebration drink:</strong> If desired, toast your accomplishment</li>
            </ul>
            
            <h4>Recovery Tips</h4>
            <ul>
              <li><strong>Hot shower or bath:</strong> Helps relax muscles and process the day</li>
              <li><strong>Light massage:</strong> Self-massage or professional if available</li>
              <li><strong>Reflection time:</strong> Process the experience and its significance</li>
              <li><strong>Connection:</strong> Share experience with loved ones back home</li>
              <li><strong>Planning:</strong> Consider what other adventures await</li>
            </ul>
          </div>
          
          <h3>Certificate and Mementos</h3>
          
          <div class="certificates-mementos">
            <h4>Official Recognition</h4>
            <ul>
              <li><strong>Completion certificate:</strong> Most operators provide certificates</li>
              <li><strong>Rapids conquered:</strong> Documentation of specific rapids completed</li>
              <li><strong>Group achievements:</strong> Team-based accomplishments</li>
              <li><strong>Personal milestones:</strong> Individual courage or improvement noted</li>
            </ul>
            
            <h4>Souvenir Options</h4>
            <ul>
              <li><strong>Operator merchandise:</strong> T-shirts, stickers, patches</li>
              <li><strong>Local crafts:</strong> Handmade items from local artisans</li>
              <li><strong>Photography packages:</strong> Professional photo collections</li>
              <li><strong>Maps and guides:</strong> Detailed river maps or guidebooks</li>
            </ul>
          </div>
          
          <h3>Follow-up and Feedback</h3>
          
          <div class="follow-up">
            <h4>Operator Follow-up</h4>
            <ul>
              <li><strong>Satisfaction surveys:</strong> Provide feedback on your experience</li>
              <li><strong>Photo delivery:</strong> Receive final photo/video packages</li>
              <li><strong>Future trip offers:</strong> Information about other adventures</li>
              <li><strong>Referral programs:</strong> Benefits for recommending friends</li>
            </ul>
            
            <h4>Your Follow-up Actions</h4>
            <ul>
              <li><strong>Online reviews:</strong> Share honest feedback on review platforms</li>
              <li><strong>Social media tags:</strong> Tag operators and locations appropriately</li>
              <li><strong>Recommendation sharing:</strong> Tell friends and family about experience</li>
              <li><strong>Planning next adventures:</strong> What's next on your adventure list?</li>
            </ul>
          </div>
        `
      },
      {
        id: 'other-activities',
        title: 'Other Jinja Activities',
        content: `
          <p>Jinja offers much more than just white water rafting. The town has developed into East Africa's adventure sports capital, with numerous activities that complement your rafting experience perfectly.</p>
          
          <h3>Water-Based Adventures</h3>
          
          <div class="water-activities">
            <div class="activity-card">
              <h4>🚣‍♂️ Kayaking</h4>
              <ul>
                <li><strong>Flat water kayaking:</strong> Perfect for beginners on Lake Victoria</li>
                <li><strong>White water kayaking:</strong> For experienced paddlers wanting solo challenges</li>
                <li><strong>Multi-day courses:</strong> Learn kayaking while exploring the Nile</li>
                <li><strong>Equipment rental:</strong> Quality kayaks and safety gear available</li>
              </ul>
              <p><strong>Best for:</strong> Paddle sports enthusiasts, those wanting quieter water time</p>
            </div>
            
            <div class="activity-card">
              <h4>🏄‍♂️ Stand-Up Paddleboarding (SUP)</h4>
              <ul>
                <li><strong>Lake Victoria SUP:</strong> Calm water perfect for learning</li>
                <li><strong>Nile River SUP:</strong> More challenging in flowing water</li>
                <li><strong>Sunrise/sunset sessions:</strong> Beautiful lighting for photography</li>
                <li><strong>Yoga SUP:</strong> Combine yoga practice with paddleboarding</li>
              </ul>
              <p><strong>Best for:</strong> Fitness enthusiasts, yoga practitioners, photographers</p>
            </div>
            
            <div class="activity-card">
              <h4>🎣 Sport Fishing</h4>
              <ul>
                <li><strong>Nile Perch fishing:</strong> Lake Victoria's famous giant fish</li>
                <li><strong>Tiger fish:</strong> Challenging fighting fish in the Nile</li>
                <li><strong>Catch and release programs:</strong> Sustainable fishing practices</li>
                <li><strong>Guided fishing tours:</strong> Local expertise for best spots</li>
              </ul>
              <p><strong>Best for:</strong> Fishing enthusiasts, those seeking relaxation</p>
            </div>
            
            <div class="activity-card">
              <h4>🛥️ Boat Cruises</h4>
              <ul>
                <li><strong>Source of the Nile tours:</strong> Historical and geographical significance</li>
                <li><strong>Sunset cruises:</strong> Romantic or group evening experiences</li>
                <li><strong>Bird watching boats:</strong> Specialized for wildlife observation</li>
                <li><strong>Island hopping:</strong> Explore Lake Victoria's islands</li>
              </ul>
              <p><strong>Best for:</strong> Couples, families, bird watchers, history buffs</p>
            </div>
          </div>
          
          <h3>Aerial Adventures</h3>
          
          <div class="aerial-activities">
            <div class="activity-card">
              <h4>🪂 Bungee Jumping</h4>
              <ul>
                <li><strong>44-meter drop:</strong> Over the Nile River</li>
                <li><strong>Safety record:</strong> International safety standards</li>
                <li><strong>Photo packages:</strong> Professional photography available</li>
                <li><strong>Combination deals:</strong> Often paired with other activities</li>
              </ul>
              <p><strong>Adrenaline factor:</strong> Extreme | <strong>Duration:</strong> 2-3 hours including briefing</p>
            </div>
            
            <div class="activity-card">
              <h4>🪂 Skydiving</h4>
              <ul>
                <li><strong>Tandem jumps:</strong> No experience required</li>
                <li><strong>Scenic views:</strong> Lake Victoria and Nile River from above</li>
                <li><strong>Video packages:</strong> Record your jump experience</li>
                <li><strong>Weather dependent:</strong> Clear days only for safety</li>
              </ul>
              <p><strong>Adrenaline factor:</strong> Maximum | <strong>Duration:</strong> Half day</p>
            </div>
            
            <div class="activity-card">
              <h4>🚁 Helicopter Tours</h4>
              <ul>
                <li><strong>Scenic flights:</strong> Aerial views of Source of the Nile</li>
                <li><strong>Photography tours:</strong> Perfect angles for stunning shots</li>
                <li><strong>Custom routes:</strong> Tailored to your interests</li>
                <li><strong>Group bookings:</strong> Share costs with other travelers</li>
              </ul>
              <p><strong>Adrenaline factor:</strong> Low-Medium | <strong>Duration:</strong> 15 minutes to 2 hours</p>
            </div>
          </div>
          
          <h3>Land-Based Adventures</h3>
          
          <div class="land-activities">
            <div class="activity-card">
              <h4>🚵‍♂️ Mountain Biking</h4>
              <ul>
                <li><strong>Village trails:</strong> Explore rural communities and countryside</li>
                <li><strong>Forest paths:</strong> Through tropical vegetation and wildlife areas</li>
                <li><strong>Cultural stops:</strong> Visit schools, markets, and local projects</li>
                <li><strong>Varying difficulty:</strong> Routes for all skill levels</li>
              </ul>
              <p><strong>Best for:</strong> Cultural immersion, fitness, environmental appreciation</p>
            </div>
            
            <div class="activity-card">
              <h4>🥾 Hiking and Walking</h4>
              <ul>
                <li><strong>Source of the Nile walk:</strong> Historical significance exploration</li>
                <li><strong>Village walks:</strong> Community-based tourism experiences</li>
                <li><strong>Forest hikes:</strong> Bird watching and nature appreciation</li>
                <li><strong>Fitness walks:</strong> Gentle exercise with scenic views</li>
              </ul>
              <p><strong>Best for:</strong> All fitness levels, cultural learning, relaxation</p>
            </div>
            
            <div class="activity-card">
              <h4>🏇 Horseback Riding</h4>
              <ul>
                <li><strong>Riverside trails:</strong> Along the Nile River banks</li>
                <li><strong>Village exploration:</strong> Access areas unreachable by vehicle</li>
                <li><strong>Sunset rides:</strong> Beautiful lighting and cooler temperatures</li>
                <li><strong>All experience levels:</strong> From beginners to advanced riders</li>
              </ul>
              <p><strong>Best for:</strong> Animal lovers, unique perspectives, romantic experiences</p>
            </div>
          </div>
          
          <h3>Cultural and Educational Activities</h3>
          
          <div class="cultural-activities">
            <div class="activity-card">
              <h4>🏛️ Historical Sites</h4>
              <ul>
                <li><strong>Source of the Nile Monument:</strong> Historical marker and museum</li>
                <li><strong>Speke Monument:</strong> Commemorating the explorer who "discovered" the source</li>
                <li><strong>Gandhi Monument:</strong> Recognizing Gandhi's time in Uganda</li>
                <li><strong>Local museums:</strong> Cultural and historical exhibits</li>
              </ul>
              <p><strong>Educational value:</strong> High | <strong>Time required:</strong> 2-4 hours</p>
            </div>
            
            <div class="activity-card">
              <h4>🎭 Cultural Experiences</h4>
              <ul>
                <li><strong>Traditional dancing:</strong> Local dance performances and lessons</li>
                <li><strong>Drum making:</strong> Learn traditional instrument crafting</li>
                <li><strong>Local cooking classes:</strong> Prepare traditional Ugandan dishes</li>
                <li><strong>Community projects:</strong> Volunteer opportunities</li>
              </ul>
              <p><strong>Cultural immersion:</strong> Maximum | <strong>Impact:</strong> Community benefit</p>
            </div>
            
            <div class="activity-card">
              <h4>🛍️ Markets and Shopping</h4>
              <ul>
                <li><strong>Jinja Main Market:</strong> Local produce, crafts, and goods</li>
                <li><strong>Craft markets:</strong> Handmade souvenirs and art</li>
                <li><strong>Source Café:</strong> Fair trade shopping and dining</li>
                <li><strong>Local cooperatives:</strong> Support community businesses</li>
              </ul>
              <p><strong>Best for:</strong> Souvenir shopping, cultural insight, supporting locals</p>
            </div>
          </div>
          
          <h3>Relaxation and Wellness</h3>
          
          <div class="wellness-activities">
            <div class="activity-card">
              <h4>🧘‍♀️ Wellness Activities</h4>
              <ul>
                <li><strong>Yoga sessions:</strong> Riverside or lakeside yoga classes</li>
                <li><strong>Massage therapy:</strong> Post-adventure muscle relief</li>
                <li><strong>Meditation retreats:</strong> Peaceful locations for reflection</li>
                <li><strong>Spa treatments:</strong> Local and international wellness practices</li>
              </ul>
              <p><strong>Perfect for:</strong> Recovery, stress relief, spiritual connection</p>
            </div>
            
            <div class="activity-card">
              <h4>🍽️ Culinary Experiences</h4>
              <ul>
                <li><strong>Local restaurants:</strong> Authentic Ugandan cuisine</li>
                <li><strong>International options:</strong> Indian, European, and fusion restaurants</li>
                <li><strong>Cooking classes:</strong> Learn to prepare local dishes</li>
                <li><strong>Farm visits:</strong> Source of ingredients tours</li>
              </ul>
              <p><strong>Cultural value:</strong> High | <strong>Social aspect:</strong> Great for groups</p>
            </div>
          </div>
          
          <h3>Multi-Activity Packages</h3>
          
          <div class="activity-packages">
            <h4>Popular Combinations</h4>
            <ul>
              <li><strong>Adventure Triple:</strong> Rafting + Bungee + Kayaking</li>
              <li><strong>Cultural Combo:</strong> Village walk + Cooking class + Traditional dance</li>
              <li><strong>Aerial Package:</strong> Helicopter tour + Skydiving + Photography</li>
              <li><strong>Relaxation Bundle:</strong> Boat cruise + Spa treatment + Yoga</li>
              <li><strong>Explorer Special:</strong> Biking + Hiking + Cultural visit</li>
            </ul>
            
            <h4>Package Benefits</h4>
            <ul>
              <li><strong>Cost savings:</strong> Usually 10-20% cheaper than individual bookings</li>
              <li><strong>Coordinated logistics:</strong> Seamless transportation and timing</li>
              <li><strong>Variety:</strong> Experience different types of adventures</li>
              <li><strong>Group dynamics:</strong> Share experiences with same group</li>
            </ul>
          </div>
          
          <h3>Seasonal Activity Considerations</h3>
          
          <table class="seasonal-activities">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Best Season</th>
                <th>Weather Dependency</th>
                <th>Booking Advice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>White Water Rafting</td>
                <td>Year-round</td>
                <td>Moderate</td>
                <td>Book 2-7 days ahead</td>
              </tr>
              <tr>
                <td>Bungee Jumping</td>
                <td>Dry season preferred</td>
                <td>High</td>
                <td>Same day usually possible</td>
              </tr>
              <tr>
                <td>Skydiving</td>
                <td>Clear weather only</td>
                <td>Very High</td>
                <td>Book with flexible dates</td>
              </tr>
              <tr>
                <td>Cultural Activities</td>
                <td>Year-round</td>
                <td>Low</td>
                <td>Advance booking recommended</td>
              </tr>
              <tr>
                <td>Water Sports</td>
                <td>Calmer seasons</td>
                <td>Moderate</td>
                <td>Check conditions daily</td>
              </tr>
            </tbody>
          </table>
        `
      }
    ],
    relatedAccommodations: [
      {
        id: 'adrift-river-base',
        name: 'Adrift River Base',
        location: 'Nile River, Jinja',
        rating: 4.7,
        reviews: 298,
        price: 95,
        originalPrice: 120,
        image: '🏕️',
        features: ['Riverside Camping', 'Adventure Base', 'Equipment Rental', 'Restaurant'],
        description: 'Riverside camping and accommodation perfect for adventure seekers.'
      },
      {
        id: 'nile-river-camp',
        name: 'Nile River Camp',
        location: 'Bujagali Falls',
        rating: 4.5,
        reviews: 186,
        price: 65,
        originalPrice: 85,
        image: '⛺',
        features: ['Camping', 'Budget-Friendly', 'Community Vibes', 'Shared Facilities'],
        description: 'Budget-friendly camping with great community atmosphere.'
      },
      {
        id: 'jinja-nile-resort',
        name: 'Jinja Nile Resort',
        location: 'Source of the Nile',
        rating: 4.6,
        reviews: 234,
        price: 180,
        originalPrice: 220,
        image: '🏨',
        features: ['Luxury Resort', 'Nile Views', 'Pool & Spa', 'Fine Dining'],
        description: 'Luxury resort with spectacular Nile River views and amenities.'
      },
      {
        id: 'source-of-the-nile-hotel',
        name: 'Source of the Nile Hotel',
        location: 'Jinja Town Center',
        rating: 4.3,
        reviews: 167,
        price: 120,
        originalPrice: 150,
        image: '🏩',
        features: ['Historic Hotel', 'Central Location', 'Colonial Architecture', 'Restaurant'],
        description: 'Historic hotel in central Jinja with colonial charm and modern comfort.'
      }
    ],
    relatedTrips: [
      {
        id: 'jinja-adventure-package',
        title: '3-Day Jinja Adventure Package',
        location: 'Jinja Multi-Activity',
        rating: 4.8,
        reviews: 145,
        price: 420,
        originalPrice: 520,
        duration: '3 Days',
        difficulty: 'Moderate',
        image: '🌊',
        highlights: ['White Water Rafting', 'Bungee Jumping', 'Kayaking', 'Cultural Visits']
      },
      {
        id: 'nile-explorer-trip',
        title: '5-Day Nile Explorer Adventure',
        location: 'Jinja to Murchison Falls',
        rating: 4.7,
        reviews: 98,
        price: 850,
        duration: '5 Days',
        difficulty: 'Moderate',
        image: '🚣‍♂️',
        highlights: ['Multi-Day Rafting', 'Camping', 'Wildlife Safari', 'Cultural Immersion']
      },
      {
        id: 'extreme-sports-weekend',
        title: 'Extreme Sports Weekend',
        location: 'Jinja Adventure Hub',
        rating: 4.9,
        reviews: 203,
        price: 650,
        duration: '2 Days',
        difficulty: 'Challenging',
        image: '🪂',
        highlights: ['Skydiving', 'Bungee Jump', 'Grade 5 Rafting', 'Helicopter Tour']
      }
    ],
    relatedArticles: [
      {
        id: 'nile-river-history',
        title: 'The Nile River: History and Significance',
        excerpt: 'Discover the historical and geographical importance of the world\'s longest river.',
        image: '📚',
        readTime: '8 min read',
        category: 'History'
      },
      {
        id: 'adventure-sports-uganda',
        title: 'Adventure Sports Guide to Uganda',
        excerpt: 'Complete guide to adrenaline activities across Uganda beyond just rafting.',
        image: '🏔️',
        readTime: '12 min read',
        category: 'Adventure'
      },
      {
        id: 'jinja-travel-guide',
        title: 'Complete Jinja Travel Guide',
        excerpt: 'Everything you need to know about visiting Uganda\'s adventure capital.',
        image: '🗺️',
        readTime: '15 min read',
        category: 'Travel Guide'
      },
      {
        id: 'river-safety-guide',
        title: 'River Safety and Rescue Techniques',
        excerpt: 'Essential safety knowledge for all river activities and water sports.',
        image: '🛟',
        readTime: '10 min read',
        category: 'Safety'
      }
    ]
  };

  return <TravelGuideArticleTemplate articleData={articleData} />;
}