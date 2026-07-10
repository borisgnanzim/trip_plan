import sys
from pathlib import Path
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from main import app


class OpenApiTests(unittest.TestCase):
    def test_bearer_auth_scheme_is_exposed(self):
        openapi = app.openapi()
        security_schemes = openapi.get("components", {}).get("securitySchemes", {})

        self.assertIn("bearerAuth", security_schemes)
        self.assertEqual(security_schemes["bearerAuth"]["type"], "http")
        self.assertEqual(security_schemes["bearerAuth"]["scheme"], "bearer")


if __name__ == "__main__":
    unittest.main()
