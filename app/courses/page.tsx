import "./courses.css";

function Courses() {
    const courses = [
        {
            id: 1,
            title: "UI/UX Designing",
            category: "DESIGN PROGRAM",
            duration: "3 Months",
            schedule: "5 Days a Week",
            image: "/uiux.jpg",
            description:
                "Master UI and UX design by creating intuitive, engaging, and user-friendly digital experiences.",
            tags: ["UI Design", "UX Research", "Prototyping"],
            featured: true,
        },
        {
            id: 2,
            title: "Graphic Designing",
            category: "CREATIVE PROGRAM",
            duration: "3 Months",
            schedule: "5 Days a Week",
            image: "/graphicss.jpg",
            description:
                "Learn visual communication, typography, branding, and creative design techniques.",
            tags: ["Typography", "Branding", "Visual Design"],
        },
        {
            id: 3,
            title: "Adobe XD & Figma Master Class",
            category: "DESIGN TOOLS",
            duration: "1.5 Months",
            schedule: "5 Days a Week",
            image: "/adobe.jpg",
            description:
                "Learn industry-standard design tools to create professional layouts, interfaces, and interactive prototypes.",
            tags: ["Figma", "Adobe XD", "Prototyping"],
        },
        {
            id: 4,
            title: "UX Guide for Beginners",
            category: "BEGINNER PROGRAM",
            duration: "1 Month",
            schedule: "5 Days a Week",
            image: "/uxdesign.jpg",
            description:
                "Understand UX fundamentals, user research, information architecture, and usability principles.",
            tags: ["UX Basics", "User Research", "Wireframes"],
        },
        {
            id: 5,
            title: "Figma Workshop",
            category: "PRACTICAL WORKSHOP",
            duration: "2 Weeks",
            schedule: "5 Days a Week",
            image: "/figma.jpg",
            description:
                "Gain hands-on experience with Figma, from interface design to interactive prototypes.",
            tags: ["UI Design", "Components", "Prototyping"],
        },
        {
            id: 6,
            title: "Graphic Design Workshop",
            category: "PRACTICAL WORKSHOP",
            duration: "2 Weeks",
            schedule: "5 Days a Week",
            image: "/graphic-attract.jpg",
            description:
                "Explore graphic design through practical exercises in composition, color, typography, and creativity.",
            tags: ["Creativity", "Color Theory", "Layout"],
        },
    ];

    return (
        <div className="course-section">

            <div className="aboutus-top">
                <div className="aboutus-overlay">
                    <div className="container">
                        <div className="aboutus-content">
                            <span className="aboutus-subtitle">
                                EXPLORE OUR PROGRAMS
                            </span>

                            <h1>Our Courses</h1>

                            <p>
                                <a href="/">Home</a>
                                <i className="bi bi-chevron-right"></i>
                                <span>Courses</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <section className="courses-wrapper">
                <div className="courses-container container">
                    {/* <div className="courses-heading">
                        <span className="courses-label">
                            <span className="courses-label-dot"></span>
                            TRAINING PROGRAMS
                        </span>

                        <h2>
                            Discover Our <span>Courses</span>
                        </h2>

                        <p>
                            Focused design training in Kochi to help you
                            develop practical skills, build your portfolio,
                            and prepare for your career.
                        </p>
                    </div> */}

                    <div className="courses-highlight">
                        <div className="courses-highlight-icon">
                            <i className="bi bi-briefcase-fill"></i>
                        </div>

                        <div className="courses-highlight-content">
                            <h3>100% Job-Oriented Training</h3>

                            <p>
                                Learn UI designing, UX designing, Figma, Adobe
                                XD, and industry-focused design practices
                                through practical training.
                            </p>
                        </div>
                    </div>


                    <div className="courses-topbar">
                        <div>
                            <h3>Our Learning Programs</h3>
                            <p>
                                Explore a course that matches your goals.
                            </p>
                        </div>

                        <span className="courses-mode">
                            <i className="bi bi-laptop"></i>
                            Offline & Online
                        </span>
                    </div>

                    <div className="courses-grid">
                        {courses.map((course) => (
                            <article
                                className="course-card"
                                key={course.id}
                            >
                                <div className="course-card-image">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        loading="lazy"
                                    />

                                    <span className="course-category">
                                        {course.category}
                                    </span>

                                    {course.featured && (
                                        <span className="course-featured">
                                            <i className="bi bi-star-fill"></i>
                                            Popular
                                        </span>
                                    )}
                                </div>

                                <div className="course-card-content">
                                    <div className="course-duration">
                                        <span>
                                            <i className="bi bi-clock"></i>
                                            {course.duration}
                                        </span>

                                        <span>
                                            <i className="bi bi-calendar-week"></i>
                                            {course.schedule}
                                        </span>
                                    </div>

                                    <h4>{course.title}</h4>

                                    <p className="course-description">
                                        {course.description}
                                    </p>

                                    <div className="course-tags">
                                        {course.tags.map((tag) => (
                                            <span key={tag}>{tag}</span>
                                        ))}
                                    </div>

                                    <div className="course-card-footer">
                                        <span className="course-learning">
                                            <i className="bi bi-mortarboard"></i>
                                            Practical Learning
                                        </span>

                                        <a
                                            href="/contact"
                                            className="course-enquire"
                                        >
                                            Enquire Now
                                            <i className="bi bi-arrow-up-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="courses-bottom">
                        <div>
                            <h3>Ready to start your design journey?</h3>
                            <p>
                                Connect with us to find the right course for
                                your career goals.
                            </p>
                        </div>

                        <a href="/contact" className="courses-contact-btn">
                            Contact Us
                            <i className="bi bi-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Courses;