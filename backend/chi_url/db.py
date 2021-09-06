from cassandra import ConsistencyLevel
from cassandra.cluster import Cluster, ExecutionProfile, EXEC_PROFILE_DEFAULT
from cassandra.policies import DCAwareRoundRobinPolicy
import logging
from cassandra.auth import PlainTextAuthProvider
from config import Settings
from functools import lru_cache


@lru_cache()
def db_cred():
    return Settings()


_cred = db_cred()  # Load the cred from the .env

"""
Load the database credentials and keyspace name from the Environment Variables
"""
_username = _cred.db_username
_password = _cred.db_password
_keyspace = _cred.keyspace

# print(_username,_password,_keyspace)
# Database log
logging.basicConfig(handlers=[logging.FileHandler(filename='../logs/debug.log', encoding='utf-8')], level=logging.DEBUG)
logging.basicConfig(handlers=[logging.FileHandler(filename='../logs/db_error.log', encoding='utf-8')], level=logging.ERROR)

profiles = ExecutionProfile(
    load_balancing_policy=DCAwareRoundRobinPolicy(),
    # consistency_level=ConsistencyLevel.LOCAL_QUORUM,
    request_timeout=15,
)

_AUTH_PROVIDER = PlainTextAuthProvider(username=_username, password=_password)

_CLUSTER = Cluster(port=9042, ssl_context=None,
                   protocol_version=5,
                   auth_provider=_AUTH_PROVIDER,
                   execution_profiles={EXEC_PROFILE_DEFAULT: profiles})

session = _CLUSTER.connect(_keyspace)