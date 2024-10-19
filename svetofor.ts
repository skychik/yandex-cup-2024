/** Типы */

type Signal = 'GREEN' | 'LEFT' | 'RIGHT' | 'RED';
type Direction = 'FORWARD' | 'LEFT' | 'RIGHT';

type TrafficLightController = {
    subscribe: (callback: (signal: Signal) => void) => void;
}

interface ITraffic {
    go: (direction: Direction) => Promise<void>;
}

class Traffic {
    private currentSignal: Signal;
    private wantForward: (() => void)[] = [];
    private wantLeft: (() => void)[] = [];
    private wantRight: (() => void)[] = [];

    constructor(initialSignal: Signal, trafficLightController: TrafficLightController) {
        this.currentSignal = initialSignal;

        trafficLightController.subscribe((currentSignal) => {
            // Регулировщик сменил сигнал
            this.currentSignal = currentSignal;

            this.checkSignal(currentSignal);
        })
    }

    private checkSignal(signal: Signal) {
        switch (signal) {
            case "GREEN":
                this.wantForward.forEach((resolve) => resolve());
                this.wantForward = [];
                // this.wantLeft.forEach((resolve) => resolve());
                // this.wantLeft = [];
                // this.wantRight.forEach((resolve) => resolve());
                // this.wantRight = [];
                break;
            case "LEFT":
                this.wantLeft.forEach((resolve) => resolve());
                this.wantLeft = [];
                break;
            case "RIGHT":
                this.wantRight.forEach((resolve) => resolve());
                this.wantRight = [];
                break;
        }
    }

    // Вернуть промис, который зарезолвится, когда можно будет проехать в переданном направлении.
    async go(direction: Direction): Promise<void> {
        return new Promise<void>((resolve) => {
            switch (direction) {
                case "FORWARD":
                    if (this.currentSignal === "GREEN") {
                        resolve();
                        return;
                    }
                    this.wantForward.push(resolve);
                    break
                case "LEFT":
                    if ( this.currentSignal === "LEFT") {
                        resolve();
                        return;
                    }
                    this.wantLeft.push(resolve);
                    break;
                case "RIGHT":
                    if (this.currentSignal === "RIGHT") {
                        resolve();
                        return;
                    }
                    this.wantRight.push(resolve);
                    break;
            }
        });

    }
}

// exports.Traffic = Traffic;