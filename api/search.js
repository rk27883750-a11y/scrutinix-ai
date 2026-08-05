<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scrutinix AI Search Engine</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            display: flex;
            height: 100vh;
        }
        /* Sidebar Styling */
        .sidebar {
            width: 260px;
            background: #ffffff;
            border-right: 1px solid #ddd;
            display: flex;
            flex-direction: column;
            padding: 20px;
        }
        .sidebar h2 {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        .menu-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 15px;
            margin-bottom: 8px;
            text-decoration: none;
            color: #333;
            font-weight: 500;
            border-radius: 8px;
            transition: background 0.2s;
        }
        .menu-item:hover {
            background: #f0f2f5;
            color: #007bff;
        }
        /* Main Content Styling */
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        h1 { color: #222; margin-bottom: 10px; }
        p { color: #666; margin-bottom: 20px; }
        .search-box {
            width: 100%;
            max-width: 600px;
            display: flex;
            gap: 10px;
        }
        input {
            flex: 1;
            padding: 14px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 8px;
            outline: none;
        }
        button {
            padding: 14px 24px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
        }
        button:hover { background: #0056b3; }
        #result {
            margin-top: 30px;
            width: 100%;
            max-width: 600px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            white-space: pre-wrap;
            display: none;
        }
    </style>
</head>
<body>

    <!-- Sidebar -->
    <div class="sidebar">
        <h2>Scrutinix AI</h2>
        <a href="#" class="menu-item" onclick="location.reload();">➕ New Chat</a>
        <a href="#" class="menu-item" onclick="alert('AI Opportunity Finder feature is active.');">🚀 AI Opportunity Finder</a>
        <a href="#" class="menu-item" onclick="alert('Settings panel.');">⚙️ Settings</a>
    </div>

    <!-- Main Content Area -->
    <div class="main-content">
        <h1>AI Search is Changing.</h1>
        <p>Discover Your True Visibility Index Instantly.</p>
        
        <div class="search-box">
            <input type="text" id="query" placeholder="Search anything...">
            <button onclick="performSearch()">Search</button>
        </div>

        <div id="result"></div>
    </div>

    <script>
        async function performSearch() {
            const q = document.getElementById('query').value.trim();
            const resultDiv = document.getElementById('result');
            
            if (!q) {
                alert('Kripya kuch search karne ke liye likhein.');
                return;
            }

            resultDiv.style.display = 'block';
            resultDiv.innerText = 'Searching...';

            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
                const data = await response.json();
                resultDiv.innerText = data.answer || 'No response found.';
            } catch (err) {
                resultDiv.innerText = 'Error connecting to search engine.';
            }
        }
    </script>
</body>
</html>
