VISION MEDICAL GREETING STUDIO PRO
===================================

EMPLOYEE PAGE
-------------
index.html

ADMIN STUDIO
------------
admin.html

PUBLISHING A NEW OCCASION
-------------------------
1. Open admin.html from your live website.
2. Upload the new template.
3. Drag Arabic and English names to the correct positions.
4. Change fonts, sizes and colors.
5. Click "Download publish file".
6. GitHub: open site-config.json > Edit > replace all content with the downloaded file content,
   or delete the old file and upload the new site-config.json.
7. Commit changes.
8. Wait 1-2 minutes and refresh the employee page.

WHY THIS VERSION WORKS ON GITHUB PAGES
--------------------------------------
All files are in the repository root. No assets folder is required.
The published template can be embedded directly inside site-config.json.

IMPORTANT
---------
The admin page itself has no secure login because GitHub Pages is static hosting.
Do not treat the admin URL as password-protected. For secure login and cloud editing,
a backend service such as Firebase is required.
