<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Coding Portfolio</title>
    <style>
        /* General Reset and Typography */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #0a0a0a;
            overflow-x: hidden;
        }

        a {
            text-decoration: none;
            color: inherit;
        }

        ul {
            list-style: none;
        }

        /* Navigation */
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 5%;
            position: absolute;
            width: 100%;
            top: 0;
            z-index: 10;
            background: rgba(10, 10, 10, 0.8);
            backdrop-filter: blur(10px);
        }

        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: #fff;
            letter-spacing: 2px;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
        }

        .nav-links a {
            color: #ccc;
            transition: color 0.3s ease;
        }

        .nav-links a:hover {
            color: #fff;
        }

        /* Hero Section */
        .hero {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
            background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
        }

        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .hero h1 {
            font-size: 4rem;
            color: #fff;
            margin-bottom: 1rem;
            text-shadow: 0 0 20px rgba(0,0,0,0.3);
        }

        .hero p {
            font-size: 1.5rem;
            color: #eee;
            max-width: 600px;
            margin-bottom: 2rem;
        }

        .btn {
            padding: 0.8rem 2rem;
            background: #fff;
            color: #000;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s, background 0.2s;
        }

        .btn:hover {
            transform: translateY(-3px);
            background: #f0f0f0;
        }

        /* Projects Section */
        .projects {
            padding: 5rem 5%;
            background-color: #111;
        }

        .section-title {
            text-align: center;
            margin-bottom: 3rem;
            font-size: 2.5rem;
            color: #fff;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .card {
            background: #1a1a1a;
            border-radius: 10px;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid #333;
        }

        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.5);
        }

        .card-img {
            height: 200px;
            background-color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #555;
            font-size: 3rem;
        }
        
        /* Placeholder for images */
        .card-img:nth-child(2) { background-color: #444; }
        .card-img:nth-child(3) { background-color: #555; }

        .card-content {
            padding: 1.5rem;
        }

        .card-content h3 {
            color: #fff;
            margin-bottom: 0.5rem;
        }

        .card-content p {
            color: #aaa;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }

        .card-link {
            color: #e73c7e;
            font-weight: bold;
        }

        /* Contact Section */
        .contact {
            padding: 5rem 5%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            background-color: #0a0a0a;
        }

        .form-container {
            width: 100%;
            max-width: 600px;
            background: #1a1a1a;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #fff;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            background: #2a2a2a;
            border: 1px solid #444;
            color: #fff;
            border-radius: 5px;
            font-family: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #e73c7e;
        }

        /* Footer */
        footer {
            text-align: center;
            padding: 2rem;
            background: #0a0a0a;
            color: #666;
            font-size: 0.9rem;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .nav-links {
                display: none; /* Simple hiding for mobile for this example */
            }
        }
    </style>
</head>
<body>

    <nav>
        <div class="logo">PORTFOLIO.</div>
        <ul class="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>

    <header class="hero" id="home">
        <h1>Building Digital Experiences</h1>
        <p>I am a creative developer crafting immersive web interfaces and interactive prototypes.</p>
        <a href="#projects" class="btn">View My Work</a>
    </header>

    <section class="projects" id="projects">
        <h2 class="section-title">Featured Projects</h2>
        <div class="grid">
            <div class="card">
                <div class="card-img">🎨</div>
                <div class="card-content">
                    <h3>Neon Dashboard</h3>
                    <p>A high-performance analytics dashboard built with D3.js and Tailwind CSS.</p>
                    <a href="#" class="card-link">View Project &rarr;</a>
                </div>
            </div>
            <div class="card">
                <div class="card-img">⚡</div>
                <div class="card-content">
                    <h3>Web3 Marketplace</h3>
                    <p>A decentralized marketplace interface with real-time blockchain data feeds.</p>
                    <a href="#" class="card-link">View Project &rarr;</a>
                </div>
            </div>
            <div class="card">
                <div class="card-img">🚀</div>
                <div class="card-content">
                    <h3>AI Chat Interface</h3>
                    <p>An interactive terminal UI for custom AI assistants.</p>
                    <a href="#" class="card-link">View Project &rarr;</a>
                </div>
            </div>
        </div>
    </section>

    <section class="contact" id="contact">
        <div class="form-container">
            <h2 class="section-title" style="margin-bottom: 2rem;">Get In Touch</h2>
            <form>
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" placeholder="Your Name">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="Your Email">
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" rows="5" placeholder="Your Message"></textarea>
                </div>
                <button type="submit" class="btn" style="width: 100%;">Send Message</button>
            </form>
        </div>
    </section>

    <footer>
        <p>&copy; 2023 Creative Developer Portfolio. All rights reserved.</p>
    </footer>

</body>
</html>