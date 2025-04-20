#Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#npm run dev
#7 #1,2,3,4,5,6,7,8,9,10,11,12,13,14,56,57,58,59,60,61,62,25,26,27,28,29
#10 #22,8,19,39,10,7,28,24,11,40,4,20,18,6,37,9,23,5,26,17,3,35,33,38,31,15,2,12,36,27,14,32,25,1,21,16,30,13,29,34


import random
import sys

def generate_golf_score(handicap, par=72):
    """
    Generate a realistic golf score based on a player's handicap for a par-72 course,
    split into front 9 and back 9 scores.
    
    Args:
        handicap (int or float): Player's handicap (0-36, where 0 is scratch, higher is less skilled).
        par (int, optional): Course par. Defaults to 72.
    
    Returns:
        tuple: (front_9_score, back_9_score, total_score), all integers.
    """
    # Validate handicap
    if not isinstance(handicap, (int, float)) or handicap < 0:
        raise ValueError("Handicap must be a non-negative number.")
    
    # Cap handicap at 36 for realism (common max for amateurs)
    handicap = min(handicap, 36)
    
    # Expected total score is par + handicap
    expected_total = par + handicap
    
    # Variance for total score: scales from ~2 (scratch) to ~8 (high handicap)
    total_std_dev = 2 + (handicap / 36) * 6
    
    # Generate total score
    total_score = random.gauss(mu=expected_total, sigma=total_std_dev)
    
    # Minimum total score to prevent unrealistic lows
    min_total = par - 5 + (handicap // 10)
    total_score = max(total_score, min_total)
    total_score = round(total_score)
    
    # Split into front 9 and back 9 (par 36 each for par-72 course)
    front_par = par // 2  # 36
    back_par = par - front_par  # 36
    
    # Expected score per 9 is roughly half the handicap
    expected_9 = front_par + handicap / 2
    
    # Variance for each 9: scale down from total (divide by sqrt(2) for two segments)
    std_dev_9 = total_std_dev / (2 ** 0.5)  # Maintains total variance when summed
    
    # Generate front 9 score
    front_score = random.gauss(mu=expected_9, sigma=std_dev_9)
    min_front = front_par - 3 + (handicap // 20)  # Adjusted minimum for 9 holes
    front_score = max(front_score, min_front)
    front_score = round(front_score)
    
    # Back 9 score is total minus front 9 to ensure exact sum
    back_score = total_score - front_score
    
    # If back 9 score is unrealistically low, adjust scores
    min_back = back_par - 3 + (handicap // 20)
    if back_score < min_back:
        # Redistribute: increase front score to balance
        excess = min_back - back_score
        front_score += excess
        back_score = min_back
    
    return front_score, back_score, total_score

def main():
    """Handle command-line execution and print front 9, back 9, and total scores."""
    if len(sys.argv) != 2:
        print("Usage: python run.py <handicap>")
        sys.exit(1)
    
    try:
        handicap = float(sys.argv[1])
        front_9, back_9, total = generate_golf_score(handicap)
        print(f"Handicap: {handicap}")
        print(f"Front 9 score: {front_9}")
        print(f"Back 9 score: {back_9}")
        print(f"Total score: {total}")
    except ValueError as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()