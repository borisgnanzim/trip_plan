import sys
from pathlib import Path
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.security import hash_password, verify_password


class SecurityTests(unittest.TestCase):
    def test_password_hashing_and_verification(self):
        password = "stringst"
        hashed = hash_password(password)

        self.assertIsInstance(hashed, str)
        self.assertTrue(hashed)
        self.assertTrue(verify_password(password, hashed))
        self.assertFalse(verify_password("wrong-password", hashed))


if __name__ == "__main__":
    unittest.main()
