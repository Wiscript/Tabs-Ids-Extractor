# Tabs ID Extractor

**Tabs IDss Extractor** is a Chrome extension that allows users to extract IDs from open tabs, customize the extraction process using Regular Expressions, and copy or download the results in various formats. It supports light/dark themes and saves user preferences across sessions.

## Features

- **ID Extraction**: Extracts IDs from the URLs of open Chrome tabs.
- **Custom RegEx**: Allows users to input a custom regular expression to fine-tune the extraction process.
- **Clickable Links**: Extracted IDs are displayed as clickable links, allowing users to revisit the original URLs.
- **Copy Options**: Copy the extracted IDs as plain text, or as a Lua table (`local ids = { ... }`).
- **Download IDs**: Download the extracted IDs as a CSV file.
- **Light/Dark Theme**: Toggle between light and dark themes, with the selected theme saved for future sessions.

## How to Use

1. **Extract IDs**: Click the "Extract IDs" button to pull item IDs from all open tabs based on the default or custom regular expression.
2. **Custom RegEx**: Input your own regular expression to target different URL formats.
3. **Copy/Download**: Use the provided buttons to copy or download the extracted IDs in your preferred format.
4. **Toggle Theme**: Switch between light and dark themes using the theme toggle button.

### Example of a custom regular expression

From the Roblox Catalog: `https:\/\/www\.roblox\.com\/catalog\/(\d+)\/`
- You can modify the word "catalog" to e.g. "library" if you need.