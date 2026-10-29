
"use client";

import { useEffect, useRef, useState } from "react";
import "./home.css";

function LandingPage() {


    const coursesArray = [
        {
            icon: "bi bi-palette",
            title: "UI UX Designing",
            desc: "Learn UI and UX design principles, wireframing, prototyping, and user-centered design to create engaging digital experiences.",
            duration: "3 Months",
            schedule: "5 Days a Week",
            image: "https://togglemax.com/wp-content/uploads/2023/02/uiux.jpg",
            button: "Explore Course",
        },
        {
            icon: "bi bi-brush",
            title: "Graphic Designing",
            desc: "Develop creative skills in graphic design, visual communication, typography, and digital design using industry-standard tools.",
            duration: "3 Months",
            schedule: "5 Days a Week",
            image: "https://togglemax.com/wp-content/uploads/2022/11/thumb.jpg",
            button: "Explore Course",
        },
        {
            icon: "bi bi-bezier2",
            title: "Adobe XD & Figma Master Class",
            desc: "Master Figma and Adobe XD to design modern interfaces, create interactive prototypes, and build professional design projects.",
            duration: "1.5 Months",
            schedule: "5 Days a Week",
            image: "https://togglemax.com/wp-content/uploads/2022/11/thumb.jpg",
            button: "Explore Course",
        },
        {
            icon: "bi bi-lightbulb",
            title: "UX Guide for Beginners",
            desc: "Understand user experience fundamentals, user research, information architecture, and usability principles.",
            duration: "1 Month",
            schedule: "5 Days a Week",
            image: "https://togglemax.com/wp-content/uploads/2023/02/uiux.jpg",
            button: "Explore Course",
        },
        {
            icon: "bi bi-vector-pen",
            title: "Figma Workshop",
            desc: "Gain practical experience with Figma tools, components, auto layout, responsive interfaces, and interactive prototyping.",
            duration: "2 Weeks",
            schedule: "5 Days a Week",
            image: "https://togglemax.com/wp-content/uploads/2023/02/uiux.jpg",
            button: "Explore Workshop",
        },
        {
            icon: "bi bi-easel",
            title: "Graphic Design Workshop",
            desc: "Explore creative design techniques, visual composition, typography, and practical graphic design through hands-on activities.",
            duration: "2 Weeks",
            schedule: "5 Days a Week",
            image: "https://togglemax.com/wp-content/uploads/2023/02/uiux.jpg",
            button: "Explore Workshop",
        },
    ];

    const chooseUsArray = [
        {
            icon: "bi bi-laptop",
            title: "Hands-On Learning",
            desc: "Gain practical experience through real-world projects and interactive training sessions."
        },
        {
            icon: "bi bi-clock-history",
            title: "Flexible Learning",
            desc: "Choose online, offline, or recorded classes that fit your schedule and learning style."
        },
        {
            icon: "bi bi-briefcase",
            title: "Career Opportunities",
            desc: "Build job-ready skills and get guidance to explore exciting career opportunities in IT."
        },
        {
            icon: "bi bi-award",
            title: "Industry-Relevant Skills",
            desc: "Develop in-demand technical skills aligned with current industry requirements."
        },
    ];

    const firstImageArray = [
        { src: "/user.jpg", alt: "UI UX Design Training" },
        { src: "/user2.jpg", alt: "Creative Design Projects" },
        { src: "/user3.jpg", alt: "Digital Design Skills" },
        { src: "/user4.jpg", alt: "Professional Design Training" },
    ];

    const secondImageArray = [
        { src: "/user5.jpg", alt: "UI Design Projects" },
        { src: "/user6.jpg", alt: "Creative Learning" },
        { src: "/user7.jpg", alt: "Digital Creativity" },
        { src: "/user.jpg", alt: "Design Portfolio" },
    ];

    const countArray = [
        { count: 100, suffix: "%", name: "JOB ORIENTED" },
        { count: 6, suffix: "+", name: "TRAINING PROGRAMS" },
        { count: 3, suffix: "+", name: "MONTHS DURATION" },
        { count: 5, suffix: "", name: "DAYS A WEEK" },
    ];

    const [startCount, setStartCount] = useState(false);
    const countRef = useRef<HTMLDivElement>(null);
    const [counts, setCounts] = useState([0, 0, 0, 0]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStartCount(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!startCount) return;

        const duration = 2000;
        const startTime = performance.now();

        let animationFrame: number;

        const animate = (currentTime: number) => {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );


            const easedProgress = 1 - Math.pow(1 - progress, 3);

            setCounts(
                countArray.map((item) =>
                    Math.floor(item.count * easedProgress)
                )
            );

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [startCount]);

    return (
        <>
            <section className="landing-page">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-12 data-pin">
                        <div className="hero-section-top-left">
                            <div className="hero-design-badge">
                                🏆  DESIGN YOUR FUTURE
                            </div>
                            <div className="hero-title">
                                Master UI/UX Design and Shape Your Creative Future
                            </div>
                            <div className="hero-desc">
                                Learn UI/UX design through hands-on projects, creative thinking,
                                and industry-focused training. Build the skills
                                to design intuitive digital experiences and launch
                                your design career.
                            </div>
                            <div className="btn-hero">
                                <button>Explore More <i className="bi bi-arrow-right"></i></button>
                                <div className="hero-call-section">
                                    <span><i className="bi bi-telephone"></i></span>
                                    <div className="call-num-name">
                                        <div className="have-questions">
                                            Have any questions?
                                        </div>
                                        <div className="ph-hero">6282 089 962
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                        <div className="hero-right">
                            <div className="hero-image-columns">
                                <div className="hero-animation-wrapper">
                                    <div className="hero-image-track move-up">
                                        {[...firstImageArray, ...firstImageArray].map(
                                            (image, index) => (
                                                <div
                                                    className="hero-image-card"
                                                    key={`first-${index}`}
                                                >
                                                    <img
                                                        src={image.src}
                                                        alt={image.alt}
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                                <div className="hero-animation-wrapper">
                                    <div className="hero-image-track move-down">
                                        {[...secondImageArray, ...secondImageArray].map(
                                            (image, index) => (
                                                <div
                                                    className="hero-image-card"
                                                    key={`second-${index}`}
                                                >
                                                    <img
                                                        src={image.src}
                                                        alt={image.alt}
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </section>
            <div className="count-class" ref={countRef}>
                <div className="row">
                    {countArray.map((item, index) => (
                        <div className="col-lg-3 col-md-3 col-6" key={index}>
                            <div className="count-data">
                                <h2>
                                    {counts[index]}
                                    {item.suffix}
                                </h2>
                                <p>{item.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="about-landing">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-12">
                            <div className="about-landing-left">
                                <span>MEET TOGGLEMAX</span>
                                <h2>About Us</h2>
                                <div className="desc-about-landing">
                                    Togglemax is a leading IT education and training platform
                                    dedicated to helping individuals develop industry-relevant skills.
                                    We offer flexible online, offline, and recorded classes led by experienced instructors,
                                    combining practical learning with real-world knowledge. <br /><br />

                                    In addition to education, Togglemax provides IT recruitment services,
                                    connecting talented professionals with the right career opportunities. We help businesses
                                    find skilled candidates while supporting individuals in achieving their professional goals.
                                </div>
                                <button>Learn About Us</button>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-12">
                            <div className="card-about-landing">
                                <div className="row">

                                    <div className="col-lg-6 col-md-6 col-12">
                                        <div className="card-graphic2">
                                            <div className="data-about-right">
                                                <h5>EMPOWER</h5>
                                                <div className="desc-discover">Discover your potential with
                                                    industry-focused IT education and expert guidance.
                                                </div>
                                            </div>
                                            <div className="img-discover">
                                                <img src="graphic2.jpg"></img>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-12">
                                        <div className="card-graphic-img">
                                            <img src="/graphic.jpg"></img>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="why-choose container">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-12">
                        <div className="why-choose-left">
                            <h6>Features</h6>
                            <span className="feature-border">
                            </span>
                            <div className="why-choose-heading">
                                Why Student<span> Choose Us?</span>
                            </div>

                            <div className="desc-features">
                                At Togglemax, we combine expert guidance, practical learning,
                                and industry-relevant skills to help students build successful
                                careers in IT. Our flexible learning options, hands-on projects,
                                and career-focused training empower every learner to grow with
                                confidence and achieve their goals.
                            </div>
                            {/* <button>Enquire Now</button> */}
                        </div>

                    </div>

                    <div className="col-lg-6 col-md-6 col-12">
                        <div className="choose-data">
                            <div className="row">
                                {chooseUsArray.map((item, index) => (
                                    <div className="col-lg-6 col-md-6 col-12" key={index}>
                                        <div className="choose-us-cards">
                                            <div className="choose-us-icon">
                                                <i className={item.icon}></i>
                                            </div>
                                            <div>
                                                <h5>{item.title}</h5>

                                                <p>{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

          <div className="courses-section container">
    <div className="courses-heading">
        <span className="courses-subtitle">
            <i className="bi bi-mortarboard-fill"></i>
            TRAINING PROGRAMS
        </span>

        <h1>Courses We Offer</h1>

        <p>
            Explore our professional training programs, available in both
            online and offline modes, and build skills for your future.
        </p>

        <div className="course-modes">
            <span>
                <i className="bi bi-laptop"></i>
                Online Training
            </span>

            <span>
                <i className="bi bi-building"></i>
                Offline Training
            </span>
        </div>
    </div>

    <div className="row">
        {coursesArray.map((item, index) => (
            <div
                className="col-lg-4 col-md-6 col-12 card-margin"
                key={index}
            >
                <div className="card-courses">
                    <div className="course-image">
                        <img src={item.image} alt={item.title} />

                        <div className="course-icon">
                            <i className={item.icon}></i>
                        </div>
                    </div>

                    <div className="course-content">
                        <h4>{item.title}</h4>

                        <p>{item.desc}</p>

                        <div className="course-duration">
                            <span>
                                <i className="bi bi-clock"></i>
                                {item.duration}
                            </span>

                            <span>
                                <i className="bi bi-calendar-week"></i>
                                {item.schedule}
                            </span>
                        </div>

                        <button className="course-button">
                            {item.button}
                            <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
</div>
        </>
    )
}

export default LandingPage;