// src/data/AutomationData.js
export const AutomationData = {
  phases: [
    {
      name: "Foundations",
      days: [
        { 
          day: 1, 
          title: "Environment Setup 💻", 
          tasks: ["Install VS Code, Node.js, and Git", "Set up new project with Playwright", "Install Postman"], 
          questions: ["What is Playwright and why is it good for automation?", "What are benefits of using TypeScript with Playwright?", "What is Node.js and how does it relate to automation?"] 
        },
        { 
          day: 2, 
          title: "Playwright Fundamentals", 
          tasks: ["Write basic script to open website", "Check website title", "Take screenshot"], 
          questions: ["Explain core components of Playwright (Browser, Context, Page)", "Difference between sync and async operations?", "How to ensure page loaded before interaction?"] 
        },
        { 
          day: 3, 
          title: "Element Locators", 
          tasks: ["Learn different locator strategies", "Automate script with multiple locator methods", "Use getByRole, getByText, getByLabel"], 
          questions: ["What are Playwright's smart locators?", "How to handle dynamic element attributes?", "Best practice for choosing locators?"] 
        },
        { 
          day: 4, 
          title: "Test Framework Integration", 
          tasks: ["Refactor scripts to use Playwright Test framework", "Understand describe, test, expect syntax"], 
          questions: ["Why use test runner like Playwright Test?", "What is expect assertion and common matchers?", "How does Playwright Test structure files?"] 
        },
        { 
          day: 5, 
          title: "Basic Interactions & Workflow", 
          tasks: ["Automate login flow", "Automate user registration form", "Interact with inputs, buttons, checkboxes"], 
          questions: ["How to type into input field?", "Difference between page.click() vs locator().click()?", "How to handle radio buttons/checkboxes?"] 
        },
        { 
          day: 6, 
          title: "Advanced Locators & Waits", 
          tasks: ["Practice CSS and XPath locators", "Implement explicit waits", "Handle dynamic content"], 
          questions: ["Difference between waitForSelector vs locator().waitFor()?", "When to choose XPath over Playwright locator?", "Hard wait vs explicit wait?"] 
        },
        { 
          day: 7, 
          title: "Version Control with Git", 
          tasks: ["Set up Git repository", "Commit and push to GitHub", "Write README.md"], 
          questions: ["Why is version control important?", "What is git clone, commit, push?", "How to collaborate using Git?"] 
        }
      ]
    },
    {
      name: "Web Automation",
      days: [
        { 
          day: 8, 
          title: "Page Object Model (POM) - Day 1", 
          tasks: ["Learn POM design pattern", "Create page files", "Start refactoring tests"], 
          questions: ["What is POM and problem it solves?", "How to structure POM for complex website?", "How does POM make maintenance easier?"] 
        },
        { 
          day: 9, 
          title: "Page Object Model (POM) - Day 2", 
          tasks: ["Complete POM refactoring", "Create page classes for all pages", "Implement page methods"], 
          questions: ["Best practices for POM structure?", "How to handle page inheritance?", "Managing page data in POM?"] 
        },
        { 
          day: 10, 
          title: "E-commerce Flow - Login & Search", 
          tasks: ["Automate login flow", "Automate product search", "Handle search results"], 
          questions: ["How to handle product not found scenario?", "Best practices for login automation?", "Handling search variations?"] 
        },
        { 
          day: 11, 
          title: "E-commerce Flow - Cart Management", 
          tasks: ["Automate add to cart", "View cart functionality", "Handle cart operations"], 
          questions: ["How to verify cart contents?", "Handling cart state changes?", "Testing cart edge cases?"] 
        },
        { 
          day: 12, 
          title: "E-commerce Flow - Checkout", 
          tasks: ["Automate checkout process", "Handle payment forms", "Complete end-to-end flow"], 
          questions: ["Challenges in multi-step workflow?", "How to handle E2E test across pages?", "Testing payment workflows safely?"] 
        },
        { 
          day: 13, 
          title: "Complex Scenarios - Dropdowns & Popups", 
          tasks: ["Handle dropdown menus", "Automate popup interactions", "Handle browser alerts"], 
          questions: ["How to select dropdown options?", "Handling browser alerts in Playwright?", "Best practices for popup handling?"] 
        },
        { 
          day: 14, 
          title: "File Operations", 
          tasks: ["Implement file uploads", "Handle file downloads", "Verify file operations"], 
          questions: ["How to verify file download?", "Handling different file types?", "Testing file upload scenarios?"] 
        },
        { 
          day: 15, 
          title: "Soft Assertions & Retries", 
          tasks: ["Implement soft assertions", "Configure test retries", "Handle flaky tests"], 
          questions: ["What are soft assertions and when useful?", "What is flaky test and how to handle?", "How do auto-waits reduce flakiness?"] 
        },
        { 
          day: 16, 
          title: "Test Reports with Allure", 
          tasks: ["Integrate Allure Reporter", "Configure HTML reports", "Customize report content"], 
          questions: ["Why are test reports important?", "What to include in good test report?", "How to configure Playwright reporters?"] 
        },
        { 
          day: 17, 
          title: "Data-Driven Testing", 
          tasks: ["Parameterize login test", "Read data from JSON/CSV", "Implement data loops"], 
          questions: ["What is data-driven testing?", "Handling multiple datasets in Playwright?", "JSON vs database for test data?"] 
        },
        { 
          day: 18, 
          title: "Project Documentation & Review", 
          tasks: ["Write project documentation", "Push code to GitHub", "Request code review"], 
          questions: ["What should good README contain?", "Ensuring code quality in automation?", "What is pull request?"] 
        }
      ]
    },
    {
      name: "API Automation",
      days: [
        { 
          day: 19, 
          title: "REST API Basics", 
          tasks: ["Understand REST API concepts", "Learn HTTP methods", "Study status codes"], 
          questions: ["What is API and why test APIs?", "Difference between GET and POST?", "What do status codes 201, 400 mean?"] 
        },
        { 
          day: 20, 
          title: "Postman to Automation", 
          tasks: ["Create Postman collection", "Add basic assertions", "Test public API"], 
          questions: ["How does Postman help development?", "Passing variables between requests?", "Can you automate tests in Postman?"] 
        },
        { 
          day: 21, 
          title: "API Automation - GET & POST", 
          tasks: ["Use Playwright request fixture", "Send GET requests", "Send POST requests"], 
          questions: ["How does request fixture differ from Axios?", "How to validate response body?", "What is JSON.stringify()?"] 
        },
        { 
          day: 22, 
          title: "API Automation - PUT & DELETE", 
          tasks: ["Automate PUT requests", "Automate DELETE requests", "Handle all CRUD operations"], 
          questions: ["REST API best practices?", "Handling API errors properly?", "Testing API state changes?"] 
        },
        { 
          day: 23, 
          title: "Authentication & Schema Validation", 
          tasks: ["Handle API authentication", "Validate JSON schema", "Test with API keys"], 
          questions: ["How to handle auth headers?", "Why validate API response schema?", "Common authentication types?"] 
        },
        { 
          day: 24, 
          title: "Combining UI and API", 
          tasks: ["Create hybrid test", "API creates user, UI logs in", "Test integration scenarios"], 
          questions: ["When to combine UI and API tests?", "What is hybrid framework?", "Functional vs integration testing?"] 
        },
        { 
          day: 25, 
          title: "API Project Refinement", 
          tasks: ["Organize API test framework", "Add logging and error handling", "Improve test structure"], 
          questions: ["Handling API request failures?", "Separating test data from logic?", "Importance of logging in API tests?"] 
        }
      ]
    },
    {
      name: "CI/CD & Advanced",
      days: [
        { 
          day: 26, 
          title: "CI/CD Basics with GitHub Actions", 
          tasks: ["Learn CI/CD concepts", "Create GitHub Actions workflow", "Run tests on code push"], 
          questions: ["Value of CI/CD for testers?", "What is GitHub Actions workflow?", "Popular CI/CD tools?"] 
        },
        { 
          day: 27, 
          title: "Run Tests in CI", 
          tasks: ["Update workflow for UI tests", "Add API tests to pipeline", "Configure test execution"], 
          questions: ["Setting up test execution order?", "Handling environment variables?", "What is build and job in pipeline?"] 
        },
        { 
          day: 28, 
          title: "Dockerizing Test Environment", 
          tasks: ["Learn Docker basics", "Create Dockerfile for tests", "Run Playwright in container"], 
          questions: ["Why Docker for automation testing?", "What is image vs container?", "Challenges running Playwright in Docker?"] 
        },
        { 
          day: 29, 
          title: "Cross-Browser Testing", 
          tasks: ["Configure multiple browsers", "Run tests on Chrome, Firefox, WebKit", "Compare browser results"], 
          questions: ["What is cross-browser testing?", "How Playwright makes it easier?", "Tools for large-scale browser testing?"] 
        },
        { 
          day: 30, 
          title: "Parallel Test Execution", 
          tasks: ["Configure parallel execution", "Optimize test performance", "Handle parallel test issues"], 
          questions: ["Benefits of parallel execution?", "Configure parallel runs in Playwright?", "Potential issues with parallel testing?"] 
        },
        { 
          day: 31, 
          title: "Advanced Reporting & Notifications", 
          tasks: ["Publish Allure reports in CI", "Configure Slack notifications", "Set up email alerts"], 
          questions: ["Making reports accessible to team?", "Why instant failure notifications?", "CI reporter vs local reporter?"] 
        },
        { 
          day: 32, 
          title: "Flaky Test Mitigation", 
          tasks: ["Identify flaky tests", "Fix unreliable tests", "Add robust waits"], 
          questions: ["Common causes of flaky tests?", "How to identify flaky tests?", "Best practices for reliable tests?"] 
        },
        { 
          day: 33, 
          title: "Environment Configurations", 
          tasks: ["Use config files", "Set environment variables", "Test against multiple environments"], 
          questions: ["Managing configs for different environments?", "Why avoid hard-coded URLs?", "Role of environment variables?"] 
        },
        { 
          day: 34, 
          title: "Final Project Refactoring", 
          tasks: ["Review entire codebase", "Refactor for clean code", "Improve documentation"], 
          questions: ["What is refactoring and why?", "Coding principles for automation?", "How to write reusable code?"] 
        },
        { 
          day: 35, 
          title: "Bug Triaging & Review", 
          tasks: ["Run full regression test", "Triage found bugs", "Document issues"], 
          questions: ["What is bug triaging?", "How to report bugs clearly?", "Bug vs test failure difference?"] 
        }
      ]
    },
    {
      name: "Capstone",
      days: [
        { 
          day: 36, 
          title: "Framework Features - Logging", 
          tasks: ["Implement robust logging", "Track test execution", "Add log levels"], 
          questions: ["Benefits of custom logging?", "What to log in automation?", "Log levels and their usage?"] 
        },
        { 
          day: 37, 
          title: "Framework Features - Exception Handling", 
          tasks: ["Add comprehensive error handling", "Handle unexpected errors", "Improve test stability"], 
          questions: ["How to handle unexpected errors?", "Recovery from test failures?", "Exception handling best practices?"] 
        },
        { 
          day: 38, 
          title: "Framework Features - Utilities", 
          tasks: ["Build reusable utility functions", "Create date helpers", "Add string generators"], 
          questions: ["Examples of reusable utilities?", "When to create helper functions?", "Organizing utility functions?"] 
        },
        { 
          day: 39, 
          title: "Advanced Data Management - Database", 
          tasks: ["Integrate database connection", "Handle complex data sources", "Real-world data scenarios"], 
          questions: ["Managing sensitive test data?", "Test data vs environment data?", "Database integration challenges?"] 
        },
        { 
          day: 40, 
          title: "Advanced Data Management - Large Datasets", 
          tasks: ["Handle large number of datasets", "Optimize data processing", "Performance considerations"], 
          questions: ["Handling large datasets efficiently?", "Memory management in tests?", "Data processing optimization?"] 
        },
        { 
          day: 41, 
          title: "Dynamic Data Generation", 
          tasks: ["Create dynamic data generation", "Unique usernames per test", "Handle data dependencies"], 
          questions: ["Data integrity across test runs?", "Dynamic vs static test data?", "Managing data dependencies?"] 
        },
        { 
          day: 42, 
          title: "Final CI/CD Integration - Full Suite", 
          tasks: ["Configure complete CI pipeline", "Ensure all tests run", "Optimize pipeline performance"], 
          questions: ["Complete CI/CD pipeline setup?", "Pipeline optimization strategies?", "Handling pipeline failures?"] 
        },
        { 
          day: 43, 
          title: "Final CI/CD Integration - Scheduling", 
          tasks: ["Set up nightly regression runs", "Schedule automated testing", "Monitor scheduled runs"], 
          questions: ["Setting up scheduled tests?", "What is nightly build?", "Benefits of continuous testing?"] 
        },
        { 
          day: 44, 
          title: "Full Regression & Bug Reporting", 
          tasks: ["Run complete regression suite", "Document all bugs found", "Prepare bug reports"], 
          questions: ["What is regression testing?", "Smoke vs regression testing?", "What is bug tracking system?"] 
        },
        { 
          day: 45, 
          title: "Final Documentation & Presentation", 
          tasks: ["Finalize README.md", "Add project summary", "Prepare presentation"], 
          questions: ["How to present automation project?", "Biggest challenges and solutions?", "How to scale this framework?"] 
        }
      ]
    }
  ]
};