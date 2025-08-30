# Why Events?

1. Notifications and Additional Logic
For example can be UserRegisteredEvent: one event handler sends a welcome email,
the other one writes an entry to the audit logs.

Result: The API returns 201 Created to the frontend, but the event triggers additional processes underneath.

2. Module Integration in a Modular Monolith
OrderPlacedEvent: one event handler in the "Payments" module verifies the payment,
other in the "Inventory" module depletes inventory.

Result: The API returns the OrderId immediately, and the logic between modules is handled through events.

3. Inter-System Integration (Event-Driven Architecture)
InvoiceCreatedEvent in your API -> the handler publishes a message to the broker (e.g., RabbitMQ, Kafka, Azure Service Bus).
Other systems respond, e.g., CRM updates customer data.

Result: The API returns the response "OK, invoice received," and further processes occur asynchronously.

4. Audit and Monitoring
Every important action (e.g., UserLoggedInEvent, PasswordChangedEvent) goes to the event bus.
The handler sends them to ElasticSearch / Grafana / Splunk.

Result: The API still returns regular responses, but events are used to track business events.

## How it works in practice
The API saves data:
UI-> POST /articles
Backend: CreateArticleCommandHandler saves the article to the DB.
Publisher -> ArticleCreatedEvent.

Handlers:
SendNotificationHandler: sends an email.
InvalidateCacheHandler: clears the cache.
IndexArticleHandler: uploads the document to the full-text search engine.

Response to UI: 201 Created + ArticleId
Events: run in parallel in the background.

## Summary
Events in the API make sense, but not as responses to the UI.
They are great for:
handling side effects (caching, notifications, logs, integrations),
communication between modules in a monolith,
asynchronous integration with other systems.
Query/Command - for direct communication with the UI (because there is always a response).
Events - for notifying other parts of the system or external systems.