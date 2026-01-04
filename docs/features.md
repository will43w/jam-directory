1. Add quick link to Google maps from jam detail page. 
2. Add button to easily share the share the link (for mobile, much like you'd share a Google maps link).
3. Create admin login functionality so that jam editing functionality can be accessed. 
   - This is broken, possibly by a redirect race condition. Fix it.
4. :done: Remove rigid recurring datetime structure. Leave "Schedule" as a text field - users can enter things like "Last Thursday of every month", or "Every other Tuesday".
5. Improve search experience. 
   - Remove filters. 
   - Search should feel semantic, e.g. search "welcoming" or "friendly" and get jams described as welcoming or friendly. 
   - You should be able to add a location (should be able to easily use your current location) and sort jams by proximity. This can be under a "[pin] Near Me" button where you can add your location seamlessly. 