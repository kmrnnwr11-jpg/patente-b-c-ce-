# Read the file
with open('../../../lib/services/theory_service.dart', 'r') as f:
    content = f.read()

# Replace the line that combines chapters with just theory chapters
old_line = "_chapters = [...signalChapters, ...theoryChapters];"
new_line = "_chapters = [...theoryChapters]; // Only load PDF lessons (signals are merged in)"

content = content.replace(old_line, new_line)

# Write back
with open('../../../lib/services/theory_service.dart', 'w') as f:
    f.write(content)

print("✅ Patched theory_service.dart to skip duplicate signals")
