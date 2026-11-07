-- 採点 (reviews)・監査ログ (audit_logs)・スキル評価 (skill_assessments) は追記のみ。
-- アプリの決まりだけでなく、データベースでも書き換えと削除を拒否する (誤った操作や、利用者の削除に伴う連鎖削除から守る)。
-- 開発用の seed は TRUNCATE で作り直すため、この制約を受けない (行単位のトリガーは TRUNCATE では動かない)。
CREATE OR REPLACE FUNCTION forbid_history_change() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION '% は追記のみです (書き換え・削除はできません)', TG_TABLE_NAME
    USING ERRCODE = 'integrity_constraint_violation';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_append_only BEFORE UPDATE OR DELETE ON "reviews"
  FOR EACH ROW EXECUTE FUNCTION forbid_history_change();
CREATE TRIGGER audit_logs_append_only BEFORE UPDATE OR DELETE ON "audit_logs"
  FOR EACH ROW EXECUTE FUNCTION forbid_history_change();
CREATE TRIGGER skill_assessments_append_only BEFORE UPDATE OR DELETE ON "skill_assessments"
  FOR EACH ROW EXECUTE FUNCTION forbid_history_change();
