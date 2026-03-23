from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import random
from agents.memory.memory import AgentMemory
from agents.utils.logger  import GLOBAL_ACTIVITY_LOGS

def log(message):
    GLOBAL_ACTIVITY_LOGS.append({
        "message": message,
        "time": time.strftime("%H:%M:%S")
    })
class Executor:

    def __init__(self, browser,max_workers=5):
        self.browser = browser
        self.memory = AgentMemory()
        self.max_workers = max_workers

    def execute(self, plan):

        steps = plan.get("steps", [])

        for step in steps:

            action = step.get("action")

            if action == "navigate":
                self._navigate(step)

            elif action == "type":
                self._type(step)

            elif action == "click":
                self._click(step)

            elif action == "extract_links":
                self._extract_links(step)

    def _navigate(self, step):
        url = step.get("url")
        self.browser.navigate(url)

    def _type(self, step):
        selector = step.get("selector")
        text = step.get("text")
        self.browser.type(selector, text)

    def _click(self, step):
        selector = step.get("selector")
        self.browser.click(selector)

    def _extract_links(self, step):

        links = self.browser.extract_links()

        save_as = step.get("save_as")

        if save_as:
            self.memory.set(save_as, links)

    def _process_links_parallel(self, step):

        memory_key = step.get("from_memory")
        links = self.memory.get(memory_key) or []

        if not links:
            log("⚠️ No links found to process")
            return

        log(f"⚡ Processing {len(links)} links in parallel...")

        results = []


        def process(link):
                try:
                    # anti-blocking delay
                    time.sleep(random.uniform(0.5, 1.5))

                    log(f"🔍 Scraping {link}")

                    data = self._scrape_page(link)

                    log(f"✅ Completed {link}")
                    return data

                except Exception as e:
                    log(f"❌ Error scraping {link}: {str(e)}")
                    return None
                
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = [executor.submit(process, link) for link in links]

            for future in as_completed(futures):
                result = future.result()
                if result:
                    results.append(result)

        save_as = step.get("save_as", "results")
        self.memory.set(save_as, results)

        log(f"📦 Stored {len(results)} results in memory as '{save_as}'")


    def _scrape_page(self, url):
        """
        Customize this function based on your scraping logic.
        Example: extract email, phone, linkedin
        """

        self.browser.navigate(url)

        #  Replace these with your real browser methods
        email = self.browser.find_email() if hasattr(self.browser, "find_email") else None
        phone = self.browser.find_phone() if hasattr(self.browser, "find_phone") else None
        linkedin = self.browser.find_linkedin() if hasattr(self.browser, "find_linkedin") else None

        return {
            "company": url,
            "email": email,
            "phone": phone,
            "linkedin": linkedin
        }