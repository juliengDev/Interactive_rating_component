import "../css/style.css";

class RatingComponent {
  private ratingValue: number = 0;
  private buttonCount: number = 0;
  private formRate: HTMLFormElement | null;
  private ratingList: HTMLUListElement | null;
  private buttonSubmit: HTMLButtonElement | null;
  private modalConfirm: HTMLElement | null;
  private ratingEl: HTMLSpanElement | null;
  private totalEl: HTMLSpanElement | null;

  constructor() {
    this.formRate = document.querySelector<HTMLFormElement>(".form-vote");
    this.ratingList = document.querySelector<HTMLUListElement>(".rating-list");
    this.buttonSubmit =
      document.querySelector<HTMLButtonElement>(".submit-btn");
    this.modalConfirm = document.querySelector<HTMLElement>(".modal");
    this.ratingEl = document.getElementById("rating") as HTMLSpanElement | null;
    this.totalEl = document.getElementById("total") as HTMLSpanElement | null;

    this.init();
  }

  private init(): void {
    if (this.ratingList) {
      const allButtons =
        this.ratingList.querySelectorAll<HTMLButtonElement>(".rating-btn");
      this.buttonCount = allButtons.length;

      this.ratingList.addEventListener(
        "click",
        this.handleRatingClick.bind(this)
      );
      this.ratingList.addEventListener(
        "keydown",
        this.handleKeyDown.bind(this)
      );
    } else {
      console.error("The element .rating-list was not found in the DOM.");
    }

    this.buttonSubmit?.addEventListener("click", this.handleSubmit.bind(this));
    this.formRate?.addEventListener(
      "keydown",
      this.handleFormKeyDown.bind(this)
    );
  }

  private handleRatingClick(event: Event): void {
    event.preventDefault();
    const target = event.target as HTMLElement;

    if (target && target.tagName === "BUTTON") {
      const button = target as HTMLButtonElement;
      this.setRating(button);
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const target = event.target as HTMLElement;
      if (target && target.tagName === "BUTTON") {
        this.setRating(target as HTMLButtonElement);
      }
    }
  }

  private handleFormKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter" && this.ratingValue > 0) {
      event.preventDefault();
      this.submitRating();
    }
  }

  private setRating(button: HTMLButtonElement): void {
    this.ratingValue = parseInt(button.textContent || "0", 10);
    this.updateButtonStyles(button);
  }

  private updateButtonStyles(selectedButton: HTMLButtonElement): void {
    const allButtons =
      this.ratingList?.querySelectorAll<HTMLButtonElement>(".rating-btn");
    allButtons?.forEach((btn) => {
      btn.classList.remove("selected");
      btn.setAttribute("aria-pressed", "false");
    });

    selectedButton.classList.add("selected");
    selectedButton.setAttribute("aria-pressed", "true");
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    this.submitRating();
  }

  private submitRating(): void {
    if (this.ratingValue > 0) {
      if (this.ratingEl)
        this.ratingEl.textContent = this.ratingValue.toString();
      if (this.totalEl) this.totalEl.textContent = this.buttonCount.toString();

      this.formRate?.classList.add("hidden");
      this.formRate?.setAttribute("aria-hidden", "true");
      this.modalConfirm?.classList.remove("hidden");
      this.modalConfirm?.removeAttribute("aria-hidden");
      this.modalConfirm?.focus();
    } else {
      this.showError("Please select a rating before submitting.");
    }
  }

  private showError(message: string): void {
    const errorEl = document.createElement("p");
    errorEl.textContent = message;
    errorEl.setAttribute("role", "alert");
    errorEl.classList.add("error-message");
    this.formRate?.appendChild(errorEl);

    setTimeout(() => {
      errorEl.remove();
    }, 3000);
  }
}

// Initialisation du composant
document.addEventListener("DOMContentLoaded", () => {
  new RatingComponent();
});
