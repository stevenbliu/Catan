def generate_axial_coords(radius=2):  # Standard Catan has 19 tiles for radius=2

    coords = []
    for q in range(-radius, radius + 1):
        for r in range(-radius, radius + 1):
            s = -q - r
            if abs(s) <= radius:
                coords.append({"q": q, "r": r})
    return coords
