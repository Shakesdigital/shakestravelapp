-- ================================================
-- SHAKES TRAVEL - ORACLE DATABASE SCHEMA
-- User-Generated Content Tables
-- ================================================
--
-- This schema creates tables for storing user-generated content:
-- 1. Experiences (Trips)
-- 2. Accommodations
-- 3. Articles (Blog Posts)
--
-- Run this script in your Oracle Database to create the tables
-- ================================================

-- ================================================
-- SEQUENCES FOR AUTO-INCREMENT IDs
-- ================================================

CREATE SEQUENCE seq_experiences
    START WITH 1000
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE SEQUENCE seq_accommodations
    START WITH 1000
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE SEQUENCE seq_articles
    START WITH 1000
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE SEQUENCE seq_experience_images
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE SEQUENCE seq_accommodation_images
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE SEQUENCE seq_article_images
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- ================================================
-- USER-GENERATED EXPERIENCES TABLE
-- ================================================

CREATE TABLE user_experiences (
    id NUMBER PRIMARY KEY,
    user_id VARCHAR2(50) NOT NULL,
    public_experience_id NUMBER UNIQUE,

    -- Basic Information
    title VARCHAR2(200) NOT NULL,
    description CLOB NOT NULL,
    overview CLOB,

    -- Location Details
    location VARCHAR2(200) NOT NULL,
    region VARCHAR2(100),
    country VARCHAR2(100) DEFAULT 'Uganda',
    latitude NUMBER(10, 7),
    longitude NUMBER(10, 7),

    -- Classification
    category VARCHAR2(50) CHECK (category IN (
        'wildlife-safari', 'gorilla-trekking', 'chimpanzee-tracking',
        'mountain-hiking', 'water-sports', 'cultural-experience',
        'city-tour', 'adventure-sports', 'bird-watching', 'photography-tour',
        'village-tour', 'food-and-culinary', 'nightlife', 'wellness-spa', 'other'
    )),
    difficulty VARCHAR2(20) CHECK (difficulty IN ('easy', 'moderate', 'challenging', 'extreme')),

    -- Pricing
    price NUMBER(10, 2) NOT NULL,
    original_price NUMBER(10, 2),
    currency VARCHAR2(3) DEFAULT 'USD',
    price_includes CLOB,

    -- Duration
    duration VARCHAR2(100),
    duration_days NUMBER,
    duration_hours NUMBER,

    -- Capacity
    max_group_size NUMBER,
    min_group_size NUMBER DEFAULT 1,

    -- Content Details
    highlights CLOB, -- JSON array
    included CLOB, -- JSON array
    excluded CLOB, -- JSON array
    itinerary CLOB, -- JSON array
    additional_info CLOB, -- JSON object

    -- Availability
    availability_type VARCHAR2(20) CHECK (availability_type IN ('daily', 'weekly', 'seasonal', 'custom')),
    available_from DATE,
    available_to DATE,
    available_days VARCHAR2(200), -- JSON array ['Mon', 'Tue', 'Wed']

    -- Features/Flags
    eco_friendly NUMBER(1) DEFAULT 0,
    instant_booking NUMBER(1) DEFAULT 0,
    free_cancel NUMBER(1) DEFAULT 0,
    pickup_included NUMBER(1) DEFAULT 0,
    featured NUMBER(1) DEFAULT 0,

    -- Status and Moderation
    status VARCHAR2(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'suspended')),
    is_active NUMBER(1) DEFAULT 1,
    submitted_at TIMESTAMP,
    approved_at TIMESTAMP,
    rejected_at TIMESTAMP,
    rejection_reason CLOB,
    review_notes CLOB,
    admin_notes CLOB,

    -- Rating and Reviews
    rating_average NUMBER(3, 2) DEFAULT 0,
    rating_count NUMBER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexes
    CONSTRAINT fk_exp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_exp_user_id ON user_experiences(user_id);
CREATE INDEX idx_exp_status ON user_experiences(status);
CREATE INDEX idx_exp_category ON user_experiences(category);
CREATE INDEX idx_exp_region ON user_experiences(region);
CREATE INDEX idx_exp_featured ON user_experiences(featured);
CREATE INDEX idx_exp_created ON user_experiences(created_at);
CREATE INDEX idx_exp_approved ON user_experiences(approved_at);

-- ================================================
-- EXPERIENCE IMAGES TABLE
-- ================================================

CREATE TABLE experience_images (
    id NUMBER PRIMARY KEY,
    experience_id NUMBER NOT NULL,
    url VARCHAR2(500) NOT NULL,
    public_id VARCHAR2(200),
    caption VARCHAR2(500),
    alt_text VARCHAR2(500),
    position NUMBER DEFAULT 0,
    is_featured NUMBER(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_expimg_exp FOREIGN KEY (experience_id) REFERENCES user_experiences(id) ON DELETE CASCADE
);

CREATE INDEX idx_expimg_exp_id ON experience_images(experience_id);

-- ================================================
-- USER-GENERATED ACCOMMODATIONS TABLE
-- ================================================

CREATE TABLE user_accommodations (
    id NUMBER PRIMARY KEY,
    user_id VARCHAR2(50) NOT NULL,
    public_accommodation_id NUMBER UNIQUE,

    -- Basic Information
    name VARCHAR2(200) NOT NULL,
    description CLOB NOT NULL,
    type VARCHAR2(50) CHECK (type IN (
        'hotel', 'lodge', 'guesthouse', 'hostel', 'apartment',
        'villa', 'resort', 'camping', 'cottage', 'boutique-hotel', 'other'
    )),

    -- Location
    location VARCHAR2(200) NOT NULL,
    address VARCHAR2(500),
    city VARCHAR2(100),
    region VARCHAR2(100),
    country VARCHAR2(100) DEFAULT 'Uganda',
    latitude NUMBER(10, 7),
    longitude NUMBER(10, 7),

    -- Pricing
    price_per_night NUMBER(10, 2) NOT NULL,
    original_price NUMBER(10, 2),
    currency VARCHAR2(3) DEFAULT 'USD',

    -- Capacity
    max_guests NUMBER NOT NULL,
    bedrooms NUMBER,
    bathrooms NUMBER,
    beds NUMBER,

    -- Amenities
    amenities CLOB, -- JSON array

    -- Policies
    cancellation_policy VARCHAR2(20) CHECK (cancellation_policy IN ('flexible', 'moderate', 'strict')),
    check_in_time VARCHAR2(50),
    check_out_time VARCHAR2(50),
    house_rules CLOB, -- JSON array

    -- Features
    has_wifi NUMBER(1) DEFAULT 0,
    has_parking NUMBER(1) DEFAULT 0,
    has_pool NUMBER(1) DEFAULT 0,
    has_kitchen NUMBER(1) DEFAULT 0,
    pet_friendly NUMBER(1) DEFAULT 0,
    featured NUMBER(1) DEFAULT 0,

    -- Status and Moderation
    status VARCHAR2(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'suspended')),
    is_active NUMBER(1) DEFAULT 1,
    submitted_at TIMESTAMP,
    approved_at TIMESTAMP,
    rejected_at TIMESTAMP,
    rejection_reason CLOB,
    review_notes CLOB,
    admin_notes CLOB,

    -- Rating and Reviews
    rating_average NUMBER(3, 2) DEFAULT 0,
    rating_count NUMBER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_acc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_acc_user_id ON user_accommodations(user_id);
CREATE INDEX idx_acc_status ON user_accommodations(status);
CREATE INDEX idx_acc_type ON user_accommodations(type);
CREATE INDEX idx_acc_location ON user_accommodations(location);
CREATE INDEX idx_acc_featured ON user_accommodations(featured);
CREATE INDEX idx_acc_created ON user_accommodations(created_at);

-- ================================================
-- ACCOMMODATION IMAGES TABLE
-- ================================================

CREATE TABLE accommodation_images (
    id NUMBER PRIMARY KEY,
    accommodation_id NUMBER NOT NULL,
    url VARCHAR2(500) NOT NULL,
    public_id VARCHAR2(200),
    caption VARCHAR2(500),
    alt_text VARCHAR2(500),
    position NUMBER DEFAULT 0,
    is_featured NUMBER(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_accimg_acc FOREIGN KEY (accommodation_id) REFERENCES user_accommodations(id) ON DELETE CASCADE
);

CREATE INDEX idx_accimg_acc_id ON accommodation_images(accommodation_id);

-- ================================================
-- USER-GENERATED ARTICLES TABLE
-- ================================================

CREATE TABLE user_articles (
    id NUMBER PRIMARY KEY,
    author_id VARCHAR2(50) NOT NULL,

    -- Content
    title VARCHAR2(200) NOT NULL,
    slug VARCHAR2(250) UNIQUE NOT NULL,
    excerpt VARCHAR2(500) NOT NULL,
    content CLOB NOT NULL,

    -- Classification
    category VARCHAR2(50) CHECK (category IN (
        'travel-guide', 'destination-review', 'travel-tips', 'cultural-insights',
        'safari-stories', 'accommodation-review', 'food-and-dining', 'adventure',
        'photography', 'budget-travel', 'luxury-travel', 'family-travel',
        'solo-travel', 'eco-tourism', 'wildlife', 'events-and-festivals'
    )),
    tags CLOB, -- JSON array

    -- Media
    featured_image_url VARCHAR2(500),
    featured_image_public_id VARCHAR2(200),
    featured_image_caption VARCHAR2(500),
    featured_image_alt VARCHAR2(500),

    -- Location (if article is location-specific)
    location_country VARCHAR2(100) DEFAULT 'Uganda',
    location_region VARCHAR2(100),
    location_city VARCHAR2(100),

    -- SEO
    seo_meta_title VARCHAR2(60),
    seo_meta_description VARCHAR2(160),
    seo_keywords CLOB, -- JSON array

    -- Moderation
    moderation_status VARCHAR2(20) DEFAULT 'draft' CHECK (moderation_status IN ('draft', 'pending', 'approved', 'rejected', 'flagged')),
    submitted_for_review_at TIMESTAMP,
    approved_at TIMESTAMP,
    rejected_at TIMESTAMP,
    rejection_reason CLOB,
    moderator_notes CLOB,

    -- Publishing
    publish_status VARCHAR2(20) DEFAULT 'draft' CHECK (publish_status IN ('draft', 'scheduled', 'published', 'archived')),
    published_at TIMESTAMP,
    scheduled_publish_at TIMESTAMP,
    archived_at TIMESTAMP,

    -- Engagement
    views_count NUMBER DEFAULT 0,
    unique_views_count NUMBER DEFAULT 0,
    likes_count NUMBER DEFAULT 0,
    shares_count NUMBER DEFAULT 0,
    comments_count NUMBER DEFAULT 0,
    bookmarks_count NUMBER DEFAULT 0,

    -- Features
    is_featured NUMBER(1) DEFAULT 0,
    is_trending NUMBER(1) DEFAULT 0,
    is_editors_pick NUMBER(1) DEFAULT 0,

    -- Content Quality
    reading_time NUMBER DEFAULT 0, -- in minutes
    quality_score NUMBER(3) DEFAULT 0, -- 0-100

    -- Visibility
    visibility VARCHAR2(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
    is_active NUMBER(1) DEFAULT 1,

    -- Versioning
    version NUMBER DEFAULT 1,
    last_edited_at TIMESTAMP,
    last_edited_by VARCHAR2(50),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_article_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_art_author_id ON user_articles(author_id);
CREATE INDEX idx_art_mod_status ON user_articles(moderation_status);
CREATE INDEX idx_art_pub_status ON user_articles(publish_status);
CREATE INDEX idx_art_category ON user_articles(category);
CREATE INDEX idx_art_slug ON user_articles(slug);
CREATE INDEX idx_art_featured ON user_articles(is_featured);
CREATE INDEX idx_art_views ON user_articles(views_count);
CREATE INDEX idx_art_created ON user_articles(created_at);
CREATE INDEX idx_art_published ON user_articles(published_at);

-- ================================================
-- ARTICLE IMAGES TABLE
-- ================================================

CREATE TABLE article_images (
    id NUMBER PRIMARY KEY,
    article_id NUMBER NOT NULL,
    url VARCHAR2(500) NOT NULL,
    public_id VARCHAR2(200),
    caption VARCHAR2(500),
    alt_text VARCHAR2(500),
    position NUMBER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_artimg_art FOREIGN KEY (article_id) REFERENCES user_articles(id) ON DELETE CASCADE
);

CREATE INDEX idx_artimg_art_id ON article_images(article_id);

-- ================================================
-- TRIGGERS FOR AUTO-INCREMENT AND TIMESTAMPS
-- ================================================

-- Experience ID trigger
CREATE OR REPLACE TRIGGER trg_exp_id
BEFORE INSERT ON user_experiences
FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        SELECT seq_experiences.NEXTVAL INTO :NEW.id FROM DUAL;
    END IF;
    IF :NEW.public_experience_id IS NULL THEN
        :NEW.public_experience_id := :NEW.id;
    END IF;
END;
/

-- Experience updated_at trigger
CREATE OR REPLACE TRIGGER trg_exp_updated
BEFORE UPDATE ON user_experiences
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

-- Experience images ID trigger
CREATE OR REPLACE TRIGGER trg_expimg_id
BEFORE INSERT ON experience_images
FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        SELECT seq_experience_images.NEXTVAL INTO :NEW.id FROM DUAL;
    END IF;
END;
/

-- Accommodation ID trigger
CREATE OR REPLACE TRIGGER trg_acc_id
BEFORE INSERT ON user_accommodations
FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        SELECT seq_accommodations.NEXTVAL INTO :NEW.id FROM DUAL;
    END IF;
    IF :NEW.public_accommodation_id IS NULL THEN
        :NEW.public_accommodation_id := :NEW.id;
    END IF;
END;
/

-- Accommodation updated_at trigger
CREATE OR REPLACE TRIGGER trg_acc_updated
BEFORE UPDATE ON user_accommodations
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

-- Accommodation images ID trigger
CREATE OR REPLACE TRIGGER trg_accimg_id
BEFORE INSERT ON accommodation_images
FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        SELECT seq_accommodation_images.NEXTVAL INTO :NEW.id FROM DUAL;
    END IF;
END;
/

-- Article ID trigger
CREATE OR REPLACE TRIGGER trg_art_id
BEFORE INSERT ON user_articles
FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        SELECT seq_articles.NEXTVAL INTO :NEW.id FROM DUAL;
    END IF;
END;
/

-- Article updated_at trigger
CREATE OR REPLACE TRIGGER trg_art_updated
BEFORE UPDATE ON user_articles
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

-- Article images ID trigger
CREATE OR REPLACE TRIGGER trg_artimg_id
BEFORE INSERT ON article_images
FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        SELECT seq_article_images.NEXTVAL INTO :NEW.id FROM DUAL;
    END IF;
END;
/

-- ================================================
-- GRANT PERMISSIONS (adjust username as needed)
-- ================================================

-- GRANT SELECT, INSERT, UPDATE, DELETE ON user_experiences TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON experience_images TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON user_accommodations TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON accommodation_images TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON user_articles TO your_app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON article_images TO your_app_user;

-- GRANT SELECT ON seq_experiences TO your_app_user;
-- GRANT SELECT ON seq_accommodations TO your_app_user;
-- GRANT SELECT ON seq_articles TO your_app_user;
-- GRANT SELECT ON seq_experience_images TO your_app_user;
-- GRANT SELECT ON seq_accommodation_images TO your_app_user;
-- GRANT SELECT ON seq_article_images TO your_app_user;

COMMIT;
