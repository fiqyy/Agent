"""
Nutrition and Athletic Fueling Advisor Tool for APEX Agent.
Calculates energy expenditure, macronutrient requirements, pre/post-workout nutrient timing,
and cognitive brain-fueling snacks for exam and study days.
"""

def calculate_nutrition_plan(athlete_profile, training_intensity="moderate", upcoming_exam=False):
    """
    Computes tailored macro targets and meal timing protocol.
    """
    weight_kg = 75.0  # Default assumption if not explicit
    daily_cal = athlete_profile.get('daily_calorie_target', 3100)
    protein_target = athlete_profile.get('daily_protein_target', 160)
    
    # Adjust for training intensity
    if training_intensity == "high":
        carb_ratio = 0.55
        protein_ratio = 0.25
        fat_ratio = 0.20
        calorie_adj = daily_cal + 350
    elif training_intensity == "recovery":
        carb_ratio = 0.40
        protein_ratio = 0.30
        fat_ratio = 0.30
        calorie_adj = daily_cal - 250
    else:
        carb_ratio = 0.50
        protein_ratio = 0.25
        fat_ratio = 0.25
        calorie_adj = daily_cal

    carbs_g = int((calorie_adj * carb_ratio) / 4)
    protein_g = max(protein_target, int((calorie_adj * protein_ratio) / 4))
    fat_g = int((calorie_adj * fat_ratio) / 9)

    protocols = [
        {
            "timing": "2 Hours Pre-Workout / Training",
            "meal": "Oatmeal with sliced banana, blueberries, honey & 1 scoop whey isolate",
            "macros": "Carbs: 65g, Protein: 28g, Fat: 6g",
            "purpose": "Glycogen saturation & sustained nitric oxide blood flow."
        },
        {
            "timing": "30-45 Mins Post-Workout",
            "meal": "Grilled chicken breast / tofu bowl with jasmine rice, roasted sweet potatoes, avocado",
            "macros": "Carbs: 80g, Protein: 45g, Fat: 14g",
            "purpose": "mTOR muscle protein synthesis & rapid glycogen replenishment."
        },
        {
            "timing": "Cognitive Deep Study Focus Snack",
            "meal": "Dark chocolate (85%) + Walnuts + Green tea with L-theanine & electrolyte water",
            "macros": "Carbs: 18g, Protein: 6g, Fat: 16g",
            "purpose": "Brain neuroprotection, sustained alpha brainwaves, zero glycemic crash."
        }
    ]

    return {
        "status": "success",
        "targets": {
            "daily_calories": calorie_adj,
            "carbohydrates_g": carbs_g,
            "protein_g": protein_g,
            "fats_g": fat_g,
            "hydration_liters": 3.8
        },
        "nutrient_timing_protocol": protocols,
        "coach_insights": (
            "Because you are balancing intense athletic sprints with demanding cognitive coursework, "
            "prioritize carbohydrate peri-workout timing to prevent mental brain fog during evening study sessions."
        )
    }
