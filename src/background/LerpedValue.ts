function lerp(v0: number, v1: number, t: number) {
  return v0 * (1 - t) + v1 * t
}

class LerpedValue {
  private targetValue: number;
  private value: number;
  private strength: number;

  constructor(value: number, strength: number) {
    this.targetValue = value;
    this.value = value;
    this.strength = strength;
  }

  setStrength(value: number) {
    this.strength = value;
  }

  set(value: number) {
    this.targetValue = value;
  }

  setAbsolute(value: number) {
    this.value = value;
    this.targetValue = value;
  }


  tick() {
    this.value = lerp(this.value, this.targetValue, this.strength);
  }

  get() {
    return this.value;
  }

  isFinished(threshold = 0.001) {
    return Math.abs(this.value - this.targetValue) < threshold;
  }
}

export default LerpedValue;