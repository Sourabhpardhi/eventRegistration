import { LightningElement, track, wire } from 'lwc';
import getEvents from '@salesforce/apex/EventRegistrationController.getEvents';
import registerForEvent from '@salesforce/apex/EventRegistrationController.registerForEvent';

export default class EventRegistration extends LightningElement {
    @track events;
    @track error;
    participantName = '';
    email = '';

    @wire(getEvents)
    wiredEvents({ error, data }) {
        if (data) {
            this.events = data;
            this.error = undefined;
        } else if (error) {
            this.error = error.body.message; // Show a specific error message
            this.events = undefined;
        }
    }

    handleNameChange(event) {
        this.participantName = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    async register(event) {
        const eventId = event.target.closest('lightning-card').key;
        try {
            await registerForEvent({ eventId, participantName: this.participantName, email: this.email });
            // Reset form after successful registration
            this.participantName = '';
            this.email = '';
            this.error = undefined; // Clear any existing errors
        } catch (error) {
            this.error = error.body.message; // Show the error message
        }
    }
}