-- migrate:up

INSERT INTO users (id, name, email, description) VALUES
    ('11111111-1111-4111-8111-111111111111', 'Alice Johnson', 'alice.johnson@example.com', 'Product lead focused on client onboarding and roadmap planning.'),
    ('22222222-2222-4222-8222-222222222222', 'Marcus Lee', 'marcus.lee@example.com', 'Frontend engineer working on dashboard usability and performance.'),
    ('33333333-3333-4333-8333-333333333333', 'Priya Shah', 'priya.shah@example.com', 'Backend engineer supporting integrations and API reliability.'),
    ('44444444-4444-4444-8444-444444444444', 'Daniel Kim', 'daniel.kim@example.com', 'Operations specialist improving delivery workflows and reporting.'),
    ('55555555-5555-4555-8555-555555555555', 'Sofia Martinez', 'sofia.martinez@example.com', 'Designer driving user experience and product consistency.');

INSERT INTO users_profiles (id, user_id, name, bio, phone) VALUES
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'Alice Johnson', 'Helps teams turn customer feedback into practical product improvements.', '+1 (415) 555-0101'),
    ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '22222222-2222-4222-8222-222222222222', 'Marcus Lee', 'Enjoys building clean interfaces and improving user flow across products.', '+1 (415) 555-0102'),
    ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', '33333333-3333-4333-8333-333333333333', 'Priya Shah', 'Works on backend services, data pipelines, and long-term maintainability.', '+1 (415) 555-0103'),
    ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', '44444444-4444-4444-8444-444444444444', 'Daniel Kim', 'Coordinates launch readiness, reporting, and process optimization.', '+1 (415) 555-0104'),
    ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', '55555555-5555-4555-8555-555555555555', 'Sofia Martinez', 'Creates polished, accessible interfaces that simplify complex workflows.', '+1 (415) 555-0105');

INSERT INTO projects (id, owner_id, name, status) VALUES
    ('10000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'Website Redesign', 'active'),
    ('10000000-0000-4000-8000-000000000002', '33333333-3333-4333-8333-333333333333', 'Client Portal Upgrade', 'in_progress'),
    ('10000000-0000-4000-8000-000000000003', '55555555-5555-4555-8555-555555555555', 'Q4 Launch Planning', 'completed');

INSERT INTO project_members (project_id, user_id, role) VALUES
    ('10000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'owner'),
    ('10000000-0000-4000-8000-000000000001', '22222222-2222-4222-8222-222222222222', 'admin'),
    ('10000000-0000-4000-8000-000000000001', '55555555-5555-4555-8555-555555555555', 'member'),
    ('10000000-0000-4000-8000-000000000002', '33333333-3333-4333-8333-333333333333', 'owner'),
    ('10000000-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', 'admin'),
    ('10000000-0000-4000-8000-000000000002', '44444444-4444-4444-8444-444444444444', 'member'),
    ('10000000-0000-4000-8000-000000000003', '55555555-5555-4555-8555-555555555555', 'owner'),
    ('10000000-0000-4000-8000-000000000003', '44444444-4444-4444-8444-444444444444', 'admin'),
    ('10000000-0000-4000-8000-000000000003', '33333333-3333-4333-8333-333333333333', 'member');

INSERT INTO tasks (id, project_id, title, description, priority, due_date, assigned_at, status) VALUES
    ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Finalize homepage wireframes', 'Review homepage layout and confirm the final information architecture.', 4, '2026-10-02', '22222222-2222-4222-8222-222222222222', 'in_progress'),
    ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Approve design system updates', 'Validate new button, card, and spacing rules with stakeholders.', 3, '2026-10-05', '55555555-5555-4555-8555-555555555555', 'pending'),
    ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', 'Integrate billing webhook', 'Connect the payment service to the customer portal and verify retries.', 5, '2026-10-08', '33333333-3333-4333-8333-333333333333', 'in_progress'),
    ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'Review access permissions', 'Audit role-based access for internal and external user groups.', 2, '2026-10-10', '11111111-1111-4111-8111-111111111111', 'completed'),
    ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000003', 'Prepare launch checklist', 'Confirm launch communications, milestones, and cross-team readiness.', 4, '2026-09-30', '44444444-4444-4444-8444-444444444444', 'completed'),
    ('20000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000003', 'Publish retrospective notes', 'Capture execution wins, risks, and recommendations for the next cycle.', 1, '2026-10-15', '55555555-5555-4555-8555-555555555555', 'pending');

-- migrate:down

DELETE FROM tasks;
DELETE FROM project_members;
DELETE FROM projects;
DELETE FROM users_profiles;
DELETE FROM users;

