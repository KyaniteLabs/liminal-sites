<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Code Portfolio | [Your Name]</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;500;700;900&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        /* Global Reset and Base Styles */
        :root {
            --primary-color: #6a11cb;
            --secondary-color: #2575fc;
            --text-dark: #1c1e22;
            --text-light: #f8f8f8;
            --bg-light: #ffffff;
            --bg-dark: #121212;
            --card-bg: #1e1e1e;
            --shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-light);
            color: var(--text-dark);
            line-height: 1.6;
            scroll-behavior: smooth;
        }

        a {
            text-decoration: none;
            color: var(--primary-color);
            transition: color 0.3s;
        }

        a:hover {
            color: var(--secondary-color);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        section {
            padding: 80px 0;
        }

        h1, h2 {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            margin-bottom: 20px;
        }

        /* --- Header/Navigation --- */
        header {
            background-color: var(--bg-light);
            padding: 15px 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        header .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.8em;
            font-weight: 900;
            color: var(--primary-color);
        }

        nav a {
            margin-left: 25px;
            color: var(--text-dark);
            font-weight: 500;
            padding: 5px 0;
            border-bottom: 2px solid transparent;
        }

        nav a:hover {
            color: var(--primary-color);
            border-bottom: 2px solid var(--primary-color);
        }

        /* --- Hero Section --- */
        #hero {
            height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            /* Animated Gradient Background */
            background: linear-gradient(135deg, #6a11cb, #2575fc, #6a11cb);
            background-size: 300% 300%;
            animation: gradient-animation 15s ease infinite;
            color: var(--text-light);
        }

        @keyframes gradient-animation {
            0% { background-position: 0% 50%; }
            50% { background-position: 50% 50%; }
            100% { background-position: 100% 50%; }
        }

        .hero-content {
            max-width: 800px;
            padding: 20px;
        }

        .hero-content h1 {
            font-size: 4em;
            margin-bottom: 15px;
            line-height: 1.1;
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .hero-content p {
            font-size: 1.4em;
            margin-bottom: 30px;
            opacity: 0.9;
        }

        .cta-button {
            display: inline-block;
            padding: 12px 30px;
            background-color: var(--text-light);
            color: var(--primary-color);
            border-radius: 50px;
            font-size: 1.1em;
            font-weight: 700;
            transition: background-color 0.3s, transform 0.3s;
            border: none;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .cta-button:hover {
            background-color: #eee;
            transform: translateY(-3px);
        }

        /* --- Projects Section --- */
        #projects {
            background-color: #f4f7fa;
        }

        #projects h2 {
            text-align: center;
            margin-bottom: 50px;
            font-size: 2.5em;
        }

        .project-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }

        .project-card {
            background: var(--bg-light);
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            transition: transform 0.3s, box-shadow 0.3s;
            display: flex;
            flex-direction: column;
        }

        .project-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .project-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background-color: #ddd; /* Placeholder color */
        }

        .card-content {
            padding: 25px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }

        .card-content h3 {
            font-size: 1.5em;
            margin-bottom: 10px;
            color: var(--primary-color);
        }

        .card-content p {
            margin-bottom: 15px;
            flex-grow: 1;
        }

        .tech-tags span {
            display: inline-block;
            margin-right: 8px;
            margin-bottom: 8px;
            background: #eef;
            color: var(--primary-color);
            font-size: 0.8em;
            padding: 5px 10px;
            border-radius: 5px;
        }

        /* --- Contact Section --- */
        #contact {
            background-color: var(--bg-dark);
            color: var(--text-light);
            text-align: center;
        }

        #contact h2 {
            color: var(--text-light);
            font-size: 2.5em;
            margin-bottom: 40px;
        }

        .contact-form-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px;
            background: var(--card-bg);
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            text-align: left;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #aaa;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #333;
            border-radius: 8px;
            background-color: #2c2c2c;
            color: var(--text-light);
            font-size: 1em;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 5px rgba(106, 17, 203, 0.5);
        }

        .submit-button {
            width: 100%;
            padding: 12px;
            background-color: var(--primary-color);
            color: var(--text-light);
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.1em;
            font-weight: 700;
            transition: background-color 0.3s;
        }

        .submit-button:hover {
            background-color: var(--secondary-color);
        }

        /* --- Footer --- */
        footer {
            background-color: #1c1c1c;
            color: #aaa;
            padding: 30px 0;
            text-align: center;
            font-size: 0.9em;
        }

        footer a {
            color: var(--primary-color);
            margin: 0 10px;
        }

        /* --- Responsiveness --- */
        @media (max-width: 900px) {
            .hero-content h1 {
                font-size: 3em;
            }
            .hero-content p {
                font-size: 1.2em;
            }
        }

        @media (max-width: 600px) {
            header .container {
                flex-direction: column;
                text-align: center;
            }
            .logo {
                margin-bottom: 10px;
            }
            nav {
                padding: top: 10px;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
            }
            nav a {
                margin: 5px 10px;
                display: inline-block;
            }
            .hero-content h1 {
                font-size: 2.5em;
            }
            .hero-content p {
                font-size: 1em;
            }
            section {
                padding: 60px 0;
            }
        }
    </style>
</head>
<body>

    <!-- Header/Navigation -->
    <header>
        <div class="container">
            <div class="logo">CODE.<span style="color: var(--secondary-color);">DEV</span></div>
            <nav>
                <a href="#hero">Home</a>
                <a href="#projects">Projects</a>
                <a href="#contact">Contact</a>
            </nav>
        </div>
    </header>

    <!-- Hero Section (Animated Gradient Background) -->
    <section id="hero">
        <div class="hero-content">
            <h1>Hi, I'm Alex.</h1>
            <p>Creative Coding Developer | Blending Art and Algorithms to Build Digital Experiences.</p>
            <a href="#projects" class="cta-button">View My Work</a>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects">
        <div class="container">
            <h2>Featured Projects</h2>
            <div class="project-grid">
                
                <!-- Project Card 1 -->
                <article class="project-card">
                    <img src="https://via.placeholder.com/400x200/6a11cb/ffffff?text=Generative+Art" alt="Project 1 Image">
                    <div class="card-content">
                        <h3>Generative Visualizer</h3>
                        <p>An interactive web visualization using p5.js, generating complex, evolving patterns based on user input.</p>
                        <div class="tech-tags">
                            <span>p5.js</span>
                            <span>JavaScript</span>
                            <span>D3.js</span>
                        </div>
                        <div style="margin-top: 15px;"><a href="#" style="display: block; text-align: right;">View Live Project &rarr;</a></div>
                    </div>
                </article>

                <!-- Project Card 2 -->
                <article class="project-card">
                    <img src="https://via.placeholder.com/400x200/2575fc/ffffff?text=Web+Interaction" alt="Project 2 Image">
                    <div class="card-content">
                        <h3>Web Audio Synthesis</h3>
                        <p>A real-time audio frequency generator built with Web Audio API, allowing users to manipulate soundscapes.</p>
                        <div class="tech-tags">
                            <span>Web Audio API</span>
                            <span>JavaScript</span>
                            <span>React</span>
                        </div>
                        <div style="margin-top: 15px;"><a href="#" style="display: block; text-align: right;">View Live Project &rarr;</a></div>
                    </div>
                </article>

                <!-- Project Card 3 -->
                <article class="project-card">
                    <img src="https://via.placeholder.com/400x200/a333ff/ffffff?text=Data+Visualization" alt="Project 3 Image">
                    <div class="card-content">
                        <h3>Algorithmic Data Map</h3>
                        <p>Visualizing complex, real-world datasets (e.g., traffic flow) using custom SVG paths and animation loops.</p>
                        <div class="tech-tags">
                            <span>D3.js</span>
                            <span>SVG</span>
                            <span>Python</span>
                        </div>
                        <div style="margin-top: 15px;"><a href="#" style="display: block; text-align: right;">View Live Project &rarr;</a></div>
                    </div>
                </article>

            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact">
        <div class="container">
            <h2>Ready to Collaborate?</h2>
            <p style="margin-bottom: 40px; color: #ccc;">Let's build something magical together. Drop me a line!</p>

            <div class="contact-form-container">
                <form action="#" method="POST">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <