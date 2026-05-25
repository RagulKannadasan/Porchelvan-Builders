try:
    from PIL import Image
    
    img = Image.open("/home/ragul/Projects/Porchelvan-Builders/frontend/public/excavator.png").convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # Greenish color detection: G > 150, R < 120, B < 120
        if item[1] > 150 and item[0] < 120 and item[2] < 120:
            newData.append((255, 255, 255, 0)) # Transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save("/home/ragul/Projects/Porchelvan-Builders/frontend/public/excavator.png", "PNG")
    print("Success")
except Exception as e:
    print(e)
