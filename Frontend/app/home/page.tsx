
"use client";

import { useEffect, useRef, useState } from "react";
import "./home.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
function LandingPage() {

    const faqArray = [
        {
            question: "What courses does Togglemax offer?",
            answer:
                "Togglemax offers professional training programs in UI/UX Designing, Graphic Designing, Figma, Adobe XD, and other creative design skills to help students build industry-relevant expertise."
        },
        {
            question: "Are online and offline classes available?",
            answer:
                "Yes, Togglemax offers flexible learning options, including online and offline classes, along with recorded sessions to help students learn at their own pace."
        },
        {
            question: "Do I need any prior design experience to join?",
            answer:
                "No prior design experience is required for beginner-friendly courses. Our structured training helps you understand the fundamentals and gradually develop practical design skills."
        },
        {
            question: "Will I get practical project experience?",
            answer:
                "Yes, our training includes hands-on projects, practical exercises, and real-world design activities that help you build your portfolio and gain confidence."
        },
        {
            question: "How long do the courses take to complete?",
            answer:
                "Course duration depends on the program you choose. We offer different learning options, ranging from short workshops to comprehensive courses lasting several months."
        },
        {
            question: "Does Togglemax provide career guidance?",
            answer:
                "Yes, Togglemax focuses on industry-relevant skills, portfolio development, and career guidance to help students prepare for opportunities in the IT and design industries."
        },
        {
            question: "Which tools will I learn during the training?",
            answer:
                "Depending on your selected course, you can learn tools such as Figma, Adobe XD, and other industry-standard design applications used to create modern digital experiences."
        },
        {
            question: "How can I enroll in a Togglemax course?",
            answer:
                "You can contact the Togglemax team to learn more about available courses, schedules, fees, and enrollment. Our team will help you choose a program that suits your goals."
        }
    ];

    const integratedArray = [
        {
            number: "01",
            title: "Explore Skills",
            desc: "Discover your interests, explore new technologies, and build a strong foundation in IT through expert guidance and structured learning programs.",
        },
        {
            number: "02",
            title: "Gain Experience",
            desc: "Turn your knowledge into practical skills through hands-on projects, interactive sessions, and real-world learning experiences.",
        },
        {
            number: "03",
            title: "Build Confidence",
            desc: "Enhance your technical expertise, improve problem-solving abilities, and develop the confidence to meet industry expectations.",
        },
    ];


    const successStoriesArray = [
        {
            name: "Nayana Chandra",
            role: "UI/UX Designer",
            company: "Creative Studio",
            course: "UI UX Designing",
            rating: 5,
            review:
                "Togglemax is an excellent place to master UI/UX design. My mentor explained concepts clearly and effectively, making learning enjoyable. I highly recommend Togglemax to anyone looking to build a successful career in UI/UX design.",
            icon: "bi bi-palette-fill",
        },
        {
            name: "Ameena Subair",
            role: "Graphic Designer",
            company: "Design Agency",
            course: "Graphic Designing",
            rating: 5,
            review:
                "The UI/UX Design course at Togglemax was a great experience. The practical training and supportive instructors helped me improve my skills. I highly recommend Togglemax to anyone looking to build a career in UI/UX design.",
            icon: "bi bi-brush-fill",
        },
        {
            name: "Abhilash Raj",
            role: "Product Designer",
            company: "Digital Solutions",
            course: "Figma Master Class",
            rating: 5,
            review:
                "The UI/UX Design course at Togglemax was an amazing experience! The instructors explained concepts clearly, and the hands-on projects helped me build practical skills. I highly recommend Togglemax to anyone looking to start a career in UI/UX design.",
            icon: "bi bi-vector-pen",
        },
        {
            name: "Vivek V",
            role: "UI Designer",
            company: "Digital Agency",
            course: "UI UX Designing",
            rating: 5,
            review:
                "Togglemax is a great place to learn UI/UX design. Jerin sir’s guidance and clear teaching made complex concepts easy to understand. His supportive approach made learning enjoyable and helped me improve my design skills. I highly recommend Togglemax to anyone pursuing a career in UI/UX design.",
            icon: "bi bi-laptop",
        },
        {
            name: "Niko cuts and designs",
            role: "Visual Designer",
            company: "Creative Agency",
            course: "Graphic Designing",
            rating: 5,
            review:
                "Togglemax is an exceptional UI/UX course institute. The instructors are industry experts, the curriculum is comprehensive, and the hands-on learning approach is highly effective. I gained practical skills and valuable insights that have boosted my career in UI/UX design. Highly recommended!",
            icon: "bi bi-brush-fill",
        },
        {
            name: "Miya G menon",
            role: "Figma Designer",
            company: "Design Studio",
            course: "Figma Master Class",
            rating: 5,
            review:
                "Togglemax is an excellent place to learn UI/UX design. Jerin Sir’s guidance made complex concepts simple and easy to understand. His supportive teaching style made learning enjoyable and helped me grow creatively. I highly recommend Togglemax to anyone looking to build a successful career in UI/UX design.",
            icon: "bi bi-vector-pen",
        },
    ];

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

    const [openFaq, setOpenFaq] = useState<number | null>(null);
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
                <div className="container">
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
                </div>
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

            <div className="success-stories">
                <div className="container">

                    <div className="success-heading">
                        <span className="courses-subtitle">
                            <i className="bi bi-stars"></i> SUCCESS STORIES
                        </span>

                        <h2>
                            Our Students, <span>Their Success</span>
                        </h2>

                        <p>
                            Discover how our training helps students develop skills
                            and work towards their career goals.
                        </p>
                    </div>

                    <div className="success-slider-wrapper">

                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            slidesPerView={3}
                            spaceBetween={25}
                            speed={700}
                            loop={successStoriesArray.length > 3}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            navigation={{
                                prevEl: ".success-prev",
                                nextEl: ".success-next",
                            }}
                            pagination={{
                                el: ".success-pagination",
                                clickable: true,
                            }}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1,
                                    spaceBetween: 15,
                                },
                                576: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                992: {
                                    slidesPerView: 3,
                                    spaceBetween: 25,
                                },
                            }}
                            className="success-swiper"
                        >
                            {successStoriesArray.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <div className="success-card">

                                        <div className="success-card-top">
                                            <div className="success-quote">
                                                <i className="bi bi-quote"></i>
                                            </div>

                                            <div className="success-rating">
                                                {Array.from(
                                                    { length: item.rating },
                                                    (_, i) => (
                                                        <i
                                                            className="bi bi-star-fill"
                                                            key={i}
                                                        ></i>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <p className="success-review">
                                            "{item.review}"
                                        </p>

                                        <div className="success-profile">
                                            <div className="success-profile-image">
                                                <span>
                                                    {item.name
                                                        .trim()
                                                        .split(/\s+/)[0]
                                                        .charAt(0)}
                                                    {item.name
                                                        .trim()
                                                        .split(/\s+/)
                                                        .slice(-1)[0]
                                                        .charAt(0)}
                                                </span>
                                            </div>

                                            <div className="success-profile-info">
                                                <h4>{item.name}</h4>
                                        
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="success-slider-controls">
                            <button
                                type="button"
                                className="success-slider-arrow success-prev"
                                aria-label="Previous student story"
                            >
                                <i className="bi bi-arrow-left"></i>
                            </button>

                        

                            <button
                                type="button"
                                className="success-slider-arrow success-next"
                                aria-label="Next student story"
                            >
                                <i className="bi bi-arrow-right"></i>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <div className="integrated-journey container">
                <div className="integrated-heading">One Integrated Journey</div>
                <div className="desc-integrated">From learning essential IT skills to gaining practical
                    experience and unlocking<br />
                    career opportunities, Togglemax guides you every step of the way.
                </div>

                <div className="row">
                    <div className="col-lg-5 col-md-5 co-12">
                        <div className="img-integrated">
                            <img src="/integrated.jpg"></img>
                        </div>
                    </div>

                    <div className="col-lg-7 col-md-7 col-12 data-integrated">

                        <div className="integrated-right">
                            {integratedArray.map((item, index) => (
                                <div className="integrated-item" key={index}>
                                    <div className="integrated-number">{item.number}</div>

                                    <div className="integrated-content">
                                        <h4>{item.title}</h4>
                                        <p>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            <div className="faq">
                <div className="container">
                    <div className="faq-heading">
                        <h2>Frequently Asked Questions</h2>

                        <div className="desc-faq">
                            Find quick answers about our courses, training options,
                            and learning opportunities at Togglemax.
                        </div>
                    </div>

                    <div className="row">
                        {faqArray.map((item, index) => (
                            <div
                                className="col-lg-6 col-md-6 col-12"
                                key={index}
                            >
                                <div
                                    className={`faq-card ${openFaq === index ? "active" : ""
                                        }`}
                                >
                                    <button
                                        type="button"
                                        className="faq-question"
                                        onClick={() =>
                                            setOpenFaq(
                                                openFaq === index ? null : index
                                            )
                                        }
                                        aria-expanded={openFaq === index}
                                        aria-controls={`faq-answer-${index}`}
                                    >
                                        <span className="faq-question-text">
                                            <span className="faq-number">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>

                                            {item.question}
                                        </span>

                                        <span className="faq-toggle">
                                            <i
                                                className={`bi ${openFaq === index
                                                    ? "bi-dash-lg"
                                                    : "bi-plus-lg"
                                                    }`}
                                            ></i>
                                        </span>
                                    </button>

                                    <div
                                        id={`faq-answer-${index}`}
                                        className={`faq-answer ${openFaq === index ? "show" : ""
                                            }`}
                                        aria-hidden={openFaq !== index}
                                    >
                                        <div className="faq-answer-content">
                                            {item.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="banner-container">
                <div className="container">
            <div className="banner-card">
                <h1>Ready to Begin Your<br />
                    <span>Design Journey?</span></h1>
                <div className="design-desc">Take the first step towards your dream career today. Our expert <br />mentors will guide you
                    from the basics to building a professional portfolio.</div>
                <div className="explore-banner">
                    <button className="courses-banner">Explore Our Courses</button>
                    <button className="book-mentorship">Book a Free Mentorship Session</button>
                </div>
                </div>
                </div>
            </div>
        </>
    )
}

export default LandingPage;