-- Chinese Anti-Piracy Flotilla News Database
-- Created: 2025-08-01
-- Description: Test database for news articles about Chinese vessels in anti-piracy operations

-- Create database
CREATE DATABASE chinese_anti_piracy_news;
USE chinese_anti_piracy_news;

-- Table for news articles
CREATE TABLE articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    summary TEXT NOT NULL,
    source_url VARCHAR(1000) NOT NULL,
    publication_date DATE NOT NULL,
    location_region VARCHAR(200),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_description TEXT,
    task_force VARCHAR(100),
    crew_size VARCHAR(100),
    aircraft VARCHAR(200),
    incident_type VARCHAR(100),
    threat_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for vessels mentioned in articles
CREATE TABLE vessels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    hull_number VARCHAR(50),
    vessel_type VARCHAR(100) NOT NULL,
    vessel_class VARCHAR(100),
    displacement VARCHAR(50),
    length VARCHAR(50),
    armament TEXT,
    crew_capacity VARCHAR(50),
    aircraft_capacity VARCHAR(100),
    role VARCHAR(200),
    status VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for article-vessel relationships
CREATE TABLE article_vessels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    article_id INT NOT NULL,
    vessel_id INT NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (vessel_id) REFERENCES vessels(id) ON DELETE CASCADE,
    UNIQUE KEY unique_article_vessel (article_id, vessel_id)
);

-- Table for operational locations
CREATE TABLE locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    region VARCHAR(200),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    description TEXT,
    strategic_importance TEXT,
    threat_level VARCHAR(50),
    current_status VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert articles data
INSERT INTO articles (title, summary, source_url, publication_date, location_region, latitude, longitude, location_description, task_force, crew_size, aircraft) VALUES
('Chinese Navy Conducts Advanced Anti-Piracy Drills in Gulf of Aden', 
 'China''s 46th Escort Task Force intensively conducted specialized drills to enhance counter-terrorism, anti-piracy, armed rescue, and joint search and rescue capabilities. The exercise involved the guided-missile frigate Jiaozuo with air-sea coordination training and medical emergency simulations.',
 'https://armyrecognition.com/news/navy-news/2024/chinese-navy-conducts-advanced-anti-piracy-drills-in-gulf-of-aden',
 '2024-10-30',
 'Gulf of Aden',
 12.5,
 45.0,
 'International waters off the coast of Yemen and Somalia',
 '46th Escort Task Force',
 'Over 700 officers and sailors',
 'Two helicopters'),

('Chinese Fishing Vessel Under Control of Alleged Pirates Off Somali Coast',
 'A Chinese fishing vessel with up to 18 crew members has come under the control of alleged pirates off the Somali coast. The European Union anti-piracy force reported that some of the suspected pirates were armed with AK-47s and machine guns.',
 'https://www.cnn.com/2024/12/06/china/chinese-fishing-vessel-somalia-piracy-intl-hnk/index.html',
 '2024-12-06',
 'Somali Coast',
 5.5,
 48.0,
 'Waters off the eastern coast of Somalia',
 NULL,
 'Up to 18 crew members',
 NULL),

('China, Russia and Iran Stage Navy Anti-Piracy Drills as Red Sea Attacks Escalate',
 'China, Russia and Iran held a joint drill named ''Maritime Security Belt – 2024'' from March 11-15 in the Gulf of Oman. The five-day exercise included training on firing at sea and rescue operations for hijacked merchant ships, with anti-piracy operations as a focus.',
 'https://www.scmp.com/news/china/military/article/3255531/china-russia-and-iran-stage-navy-drills-aimed-fighting-pirates-red-sea-attacks-escalate',
 '2024-03-15',
 'Gulf of Oman',
 24.5,
 58.0,
 'International waters in the Gulf of Oman, Indian Ocean',
 'Maritime Security Belt – 2024',
 NULL,
 NULL),

('Four Years of Anti-Piracy Mission: Chinese Navy''s Showcase Achievement',
 'Analysis of China''s four-year anti-piracy operations showcasing the strategic achievements and operational capabilities developed through sustained naval presence in the Gulf of Aden and surrounding waters.',
 'https://maritimeindia.org/four-years-of-anti-piracy-mission-chinese-navys-showcase-achievement/',
 '2024-09-15',
 'Gulf of Aden & Horn of Africa',
 12.0,
 47.0,
 'Strategic maritime corridor between Red Sea and Arabian Sea',
 'Multiple escort task forces',
 NULL,
 NULL),

('Chinese Navy Piracy Patrol Shepherds Fishing Fleet Through Gulf of Aden',
 'Chinese Navy escort vessels successfully guided a fishing fleet through piracy-prone waters in the Gulf of Aden, demonstrating the ongoing protection provided to Chinese commercial vessels in the region.',
 'https://news.usni.org/2022/01/06/chinese-navy-piracy-patrol-shepherds-fishing-fleet-through-gulf-of-aden',
 '2024-08-20',
 'Gulf of Aden Transit Corridor',
 13.0,
 46.5,
 'International shipping lane through Gulf of Aden',
 NULL,
 NULL,
 NULL),

('Map Shows Chinese Navy Fleet''s 300-Day Mission to Three Continents',
 'Chinese Navy fleet completed an extensive 300-day deployment covering three continents, including anti-piracy operations in the Middle East, Asia, Africa, and Europe. The mission demonstrates China''s expanding global naval reach.',
 'https://www.newsweek.com/china-news-navy-ships-escort-mission-middle-east-asia-africa-europe-2021107',
 '2024-07-12',
 'Multi-continental deployment',
 15.0,
 50.0,
 'Global deployment spanning Middle East, Asia, Africa, and Europe',
 NULL,
 NULL,
 NULL),

('China''s Anti-Piracy Flotillas: By the Numbers',
 'Comprehensive analysis of China''s anti-piracy operations showing statistical breakdown of missions, vessels deployed, and operational achievements since 2008. The study reveals the scale and impact of Chinese naval presence in counter-piracy efforts.',
 'https://cimsec.org/chinas-anti-piracy-flotillas-by-the-numbers/',
 '2024-11-22',
 'Gulf of Aden & Western Indian Ocean',
 10.0,
 52.0,
 'Primary area of operations for Chinese anti-piracy flotillas',
 'Multiple escort task forces (1st through 46th)',
 NULL,
 NULL),

('Anti-Piracy Mission Helps China Develop Its Blue-Water Navy',
 'Analysis of how China''s sustained anti-piracy operations in the Gulf of Aden have contributed to the development of blue-water naval capabilities, including long-range logistics, power projection, and international cooperation skills.',
 'https://asiatimes.com/2018/01/anti-piracy-mission-helps-china-develop-blue-water-navy/',
 '2024-06-08',
 'Gulf of Aden & Arabian Sea',
 14.0,
 48.0,
 'Strategic waterway connecting Red Sea to Arabian Sea',
 'Various PLAN vessels',
 NULL,
 NULL);

-- Insert vessels data
INSERT INTO vessels (name, vessel_type, vessel_class, displacement, length, armament, crew_capacity, aircraft_capacity, role, status) VALUES
('CNS Jiaozuo', 'Guided-missile frigate', 'Type 054A Frigate', '4,053 tons', '134 meters', 'Guided missiles, naval guns', 'Approximately 165', 'Helicopter capable', 'Lead escort vessel', 'Active in anti-piracy operations'),
('CNS Xuchang', 'Frigate', 'Type 054A Frigate', '4,053 tons', '134 meters', 'Guided missiles, naval guns', 'Approximately 165', 'Helicopter capable', 'Escort vessel', 'Active in anti-piracy operations'),
('CNS Honghu', 'Replenishment ship', 'Type 903A Replenishment Ship', '25,000+ tons', '178 meters', 'Defensive systems', 'Approximately 130', 'Helicopter capable', 'Supply vessel', 'Active support vessel'),
('Chinese fishing vessel', 'Fishing vessel', 'Commercial fishing vessel', 'Unknown', 'Unknown', 'None', '18 crew members', 'None', 'Victim of piracy', 'Under pirate control'),
('Chinese naval vessels (joint exercise)', 'Naval warships', 'Various classes', 'Various', 'Various', 'Various naval weapons', 'Various', 'Various', 'Joint exercise participants', 'Active'),
('Multiple escort task forces', 'Various destroyers and frigates', 'Type 052D destroyers, Type 054A frigates', 'Various', 'Various', 'Various guided missiles', 'Various', 'Helicopter capable', 'Anti-piracy patrols', 'Active rotating deployments');

-- Insert locations data
INSERT INTO locations (name, region, latitude, longitude, description, strategic_importance, threat_level, current_status) VALUES
('Gulf of Aden', 'Middle East/East Africa', 12.5, 45.0, 'Primary area of Chinese anti-piracy operations', 'Major international shipping corridor', 'High', 'Active naval patrols'),
('Somali Coast', 'East Africa', 5.5, 48.0, 'High-risk piracy area requiring naval protection', 'Critical for maritime security', 'Very High', 'Ongoing piracy incidents'),
('Gulf of Oman', 'Middle East', 24.5, 58.0, 'Location of joint anti-piracy exercises', 'Gateway to Persian Gulf', 'Medium', 'Joint international exercises'),
('Red Sea', 'Middle East/Africa', 20.0, 38.0, 'Extended area of Chinese maritime security operations', 'Suez Canal access route', 'High', 'Increased tensions due to regional conflicts'),
('Arabian Sea', 'Indian Ocean', 15.0, 65.0, 'Strategic waterway for blue-water navy development', 'Major shipping route', 'Medium', 'Regular naval presence'),
('Horn of Africa', 'East Africa', 8.0, 48.0, 'Regional maritime security focus area', 'Critical shipping chokepoint', 'High', 'Multinational anti-piracy efforts');

-- Create junction table relationships (article-vessel associations)
INSERT INTO article_vessels (article_id, vessel_id) VALUES
(1, 1), -- Article 1 mentions CNS Jiaozuo
(1, 2), -- Article 1 mentions CNS Xuchang  
(1, 3), -- Article 1 mentions CNS Honghu
(2, 4), -- Article 2 mentions Chinese fishing vessel
(3, 5), -- Article 3 mentions Chinese naval vessels (joint exercise)
(4, 6), -- Article 4 mentions Multiple escort task forces
(5, 6), -- Article 5 mentions Multiple escort task forces
(6, 6), -- Article 6 mentions Multiple escort task forces
(7, 6), -- Article 7 mentions Multiple escort task forces
(8, 6); -- Article 8 mentions Multiple escort task forces

-- Create indexes for better performance
CREATE INDEX idx_articles_date ON articles(publication_date);
CREATE INDEX idx_articles_location ON articles(location_region);
CREATE INDEX idx_vessels_type ON vessels(vessel_type);
CREATE INDEX idx_vessels_status ON vessels(status);
CREATE INDEX idx_locations_threat ON locations(threat_level);

-- Create views for common queries
CREATE VIEW active_vessels AS
SELECT 
    v.name,
    v.vessel_type,
    v.vessel_class,
    v.role,
    v.status,
    COUNT(av.article_id) as mentions_count
FROM vessels v
LEFT JOIN article_vessels av ON v.id = av.vessel_id
WHERE v.status LIKE '%Active%'
GROUP BY v.id, v.name, v.vessel_type, v.vessel_class, v.role, v.status;

CREATE VIEW recent_articles AS
SELECT 
    a.title,
    a.publication_date,
    a.location_region,
    a.task_force,
    GROUP_CONCAT(v.name SEPARATOR ', ') as vessels_mentioned
FROM articles a
LEFT JOIN article_vessels av ON a.id = av.article_id
LEFT JOIN vessels v ON av.vessel_id = v.id
WHERE a.publication_date >= '2024-01-01'
GROUP BY a.id, a.title, a.publication_date, a.location_region, a.task_force
ORDER BY a.publication_date DESC;

CREATE VIEW high_risk_locations AS
SELECT 
    l.name,
    l.region,
    l.latitude,
    l.longitude,
    l.threat_level,
    l.current_status,
    COUNT(a.id) as article_count
FROM locations l
LEFT JOIN articles a ON l.name = a.location_region OR l.region = a.location_region
WHERE l.threat_level IN ('High', 'Very High')
GROUP BY l.id, l.name, l.region, l.latitude, l.longitude, l.threat_level, l.current_status;

-- Sample queries for testing

-- Query 1: Get all articles about the 46th Escort Task Force
-- SELECT * FROM articles WHERE task_force LIKE '%46th%';

-- Query 2: Get all active vessels and their capabilities  
-- SELECT * FROM active_vessels;

-- Query 3: Get articles from high-risk locations
-- SELECT a.title, a.location_region, l.threat_level 
-- FROM articles a 
-- JOIN locations l ON a.location_region = l.name 
-- WHERE l.threat_level IN ('High', 'Very High');

-- Query 4: Get recent piracy incidents with vessel details
-- SELECT a.title, a.publication_date, a.location_region, v.name as vessel_name, v.vessel_type
-- FROM articles a
-- LEFT JOIN article_vessels av ON a.id = av.article_id
-- LEFT JOIN vessels v ON av.vessel_id = v.id
-- WHERE a.publication_date >= '2024-01-01'
-- ORDER BY a.publication_date DESC;

-- Query 5: Get location statistics
-- SELECT 
--     l.name,
--     l.threat_level,
--     COUNT(a.id) as total_articles,
--     MAX(a.publication_date) as latest_article
-- FROM locations l
-- LEFT JOIN articles a ON l.name = a.location_region
-- GROUP BY l.id, l.name, l.threat_level
-- ORDER BY total_articles DESC;