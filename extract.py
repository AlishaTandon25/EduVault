import os

pb_path = r"C:\Users\alisha  tandon\.gemini\antigravity\conversations\268078f1-fd5e-4041-b4c6-9bb56a9d743f.pb"

with open(pb_path, 'rb') as f:
    data = f.read()

# Let's search for "LANDING PAGE" encoded as UTF-16
print("UTF-16 LE LANDING PAGE:", data.find("LANDING PAGE".encode('utf-16-le')))
print("UTF-16 BE LANDING PAGE:", data.find("LANDING PAGE".encode('utf-16-be')))
print("UTF-8 LANDING PAGE:", data.find("LANDING PAGE".encode('utf-8')))

# Let's see if we can find any HTML tag like "<html>" or "<!DOCTYPE"
print("UTF-8 html:", data.find("<html>".encode('utf-8')))
print("UTF-16 LE html:", data.find("<html>".encode('utf-16-le')))
print("UTF-8 DOCTYPE:", data.find("<!DOCTYPE".encode('utf-8')))

# Let's write the first 1000 bytes in hex
print("First 1000 bytes hex:")
print(data[:1000].hex())
