export function adjustTimeToIST(timeString: string): Date {

    const originalTime = new Date(timeString);
  
    const millisecondsToSubtract = (5 * 60 * 60 * 1000) + (30 * 60 * 1000);
    const adjustedTime = new Date(originalTime.getTime() - millisecondsToSubtract);
  
    return adjustedTime;
  }