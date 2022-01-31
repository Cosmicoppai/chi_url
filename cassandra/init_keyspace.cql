
CREATE KEYSPACE IF NOT EXISTS chi_url  WITH replication = {'class': 'NetworkTopologyStrategy', 'Mumbai': '1'}  AND durable_writes = true;

CREATE TABLE IF NOT EXISTS chi_url.resolve_count (
    user text,
    url text,
    short_url text,
    resolves counter,
    PRIMARY KEY (user, short_url, url)
) WITH CLUSTERING ORDER BY (url ASC, short_url ASC)
    AND bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND cdc = false
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '16', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND speculative_retry = '99p';

CREATE TABLE IF NOT EXISTS chi_url.url_map (
    short_url text,
    created_on timestamp,
    url text,
    user text,
    PRIMARY KEY (short_url, created_on)
) WITH CLUSTERING ORDER BY (created_on DESC)
    AND bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND cdc = false
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.LeveledCompactionStrategy', 'sstable_size_in_mb': '160'}
    AND compression = {'chunk_length_in_kb': '16', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND speculative_retry = '99p';

CREATE TABLE IF NOT EXISTS chi_url.user (
    user_name text PRIMARY KEY,
    disabled boolean,
    email text,
    hashed_password text,
    verification_code text
) WITH bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND cdc = false
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.LeveledCompactionStrategy', 'sstable_size_in_mb': '160'}
    AND compression = {'chunk_length_in_kb': '16', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND speculative_retry = '99p';

CREATE INDEX IF NOT EXISTS email ON chi_url.user (email);

CREATE ROLE IF NOT EXISTS cosmicoppai with superuser = true AND LOGIN = true and PASSWORD = 'dry-flower@04';

ALTER KEYSPACE "system_auth" WITH REPLICATION = {'class' : 'NetworkTopologyStrategy', 'Mumbai': 1};